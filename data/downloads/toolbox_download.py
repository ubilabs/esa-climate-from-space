"""Shared annual/monthly Toolbox export without loading the entire data cube."""

from argparse import ArgumentParser
from contextlib import nullcontext
import json
import math
from numbers import Integral, Real
from pathlib import Path
import re
import sys

from download_utils import DOWNLOAD_ROOT, atomic_write, iso_date, positive_int, prepare_output, timestamp


def select_timestamps(values, start, end, cadence):
    """Choose the earliest actual coordinate in each requested calendar period."""
    if cadence not in ('annual', 'monthly'):
        raise ValueError(f'Unsupported output cadence: {cadence}')
    selected = {}
    seen = set()
    for index, value in sorted(enumerate(values), key=lambda item: timestamp(item[1])):
        instant = timestamp(value)
        if instant in seen:
            raise ValueError(f'Duplicate time coordinate: {instant}')
        seen.add(instant)
        if instant.date() < start or (end and instant.date() > end):
            continue
        period = (instant.year,) if cadence == 'annual' else (instant.year, instant.month)
        selected.setdefault(period, (index, instant))
    return list(selected.values())


def version_key(value):
    value = re.sub(r'^(?:fv|v)', '', str(value), flags=re.I)
    if not re.fullmatch(r'\d+(?:[.-]\d+)*', value):
        raise ValueError(f'Unrecognized provider version: {value}')
    parts = tuple(int(part) for part in re.split(r'[.-]', value))
    while len(parts) > 1 and parts[-1] == 0:
        parts = parts[:-1]
    return parts


def get_store(store_id='esa-cci'):
    from xcube.core.store import new_data_store
    if store_id == 'esa-cci':
        return new_data_store(store_id, num_retries=3)
    if store_id == 'esa-cci-zarr':
        return new_data_store(store_id)
    raise ValueError(f'Unsupported Toolbox store: {store_id}')


def spatial_subset(dataset, bbox):
    west, south, east, north = bbox
    indexers = {}
    for name, minimum, maximum in [('lat', south, north), ('lon', west, east)]:
        if name not in dataset.coords or dataset[name].ndim != 1:
            raise ValueError(f'Cannot safely subset the {name} coordinate locally.')
        coordinate = dataset[name]
        ascending = coordinate.values[0] <= coordinate.values[-1]
        indexers[name] = slice(minimum, maximum) if ascending else slice(maximum, minimum)
    subset = dataset.sel(indexers)
    if not subset.sizes.get('lat') or not subset.sizes.get('lon'):
        raise ValueError('The bounding box contains no grid-cell centres; use a wider --bbox.')
    return subset


def open_dataset(store, dataset_id, params):
    try:
        return store.open_data(dataset_id, **params)
    except AttributeError as error:
        # xcube-cci 0.14.2 calls .shape on list-valued biomass coordinate bounds
        # when bbox is supplied. A lazy xarray selection avoids that specific
        # bug without patching the provider or materializing global data arrays.
        if 'bbox' not in params or str(error) != "'list' object has no attribute 'shape'":
            raise
        print('Provider bounding-box bug; selecting the requested area on the lazy cube instead.', file=sys.stderr)
        full = store.open_data(dataset_id, **{key: value for key, value in params.items() if key != 'bbox'})
        try:
            subset = spatial_subset(full, params['bbox'])
            subset.set_close(full.close)
            return subset
        except BaseException:
            full.close()
            raise


def open_zarr_dataset(store, dataset_id, variables, bbox):
    """Generic Zarr stores do not accept the primary CCI opener's parameters."""
    full = store.open_data(dataset_id)
    try:
        selected = full[variables]
        if bbox:
            selected = spatial_subset(selected, bbox)
        selected.set_close(full.close)
        return selected
    except BaseException:
        full.close()
        raise


def validate_existing(path, variable, dataset_id, instant):
    import xarray as xr
    try:
        with xr.open_dataset(path) as dataset:
            return (
                variable in dataset
                and dataset.attrs.get('source_dataset_id') == dataset_id
                and dataset.sizes.get('time') == 1
                and timestamp(dataset.time.values[0]) == instant
            )
    except (OSError, ValueError, KeyError):
        return False


def netcdf_attributes(attributes):
    """Preserve structured Toolbox metadata as text, not unsupported objects."""
    result = {}
    for key, value in attributes.items():
        if value is None:
            continue
        if isinstance(value, bool):
            value = int(value)
        elif isinstance(value, bytes):
            value = value.decode('utf-8', errors='replace')
        elif isinstance(value, (str, Integral, Real)):
            pass
        elif hasattr(value, 'dtype') and value.dtype.kind in 'iufS' and value.ndim <= 1:
            pass
        elif isinstance(value, (list, tuple)) and value and all(isinstance(item, str) for item in value):
            value = list(value)
        elif isinstance(value, (list, tuple)) and value and all(isinstance(item, Real) for item in value):
            value = [int(item) if isinstance(item, Integral) else float(item) for item in value]
        else:
            # E.g. xcube's history is a list of dictionaries, encoded by numpy
            # as dtype=object; netCDF4 rejects it unless serialized explicitly.
            value = json.dumps(value.tolist() if hasattr(value, 'tolist') else value,
                               ensure_ascii=False, default=str)
        result[key] = value
    return result


def export_slice(dataset, index, variable, metadata, dataset_id, cadence, path, *, output_variable=None):
    # Keep a length-one time dimension and any referenced CRS variable.
    names = [variable]
    mapping = metadata.get('data_vars', {}).get(variable, {}).get('attrs', {}).get('grid_mapping')
    if mapping and mapping in dataset and mapping not in names:
        names.append(mapping)
    selected = dataset[names].isel(time=[index]).copy(deep=False)
    selected.attrs = dict(dataset.attrs)
    selected.attrs.update(source_dataset_id=dataset_id, output_sampling=cadence)
    if output_variable and output_variable != variable:
        selected = selected.rename({variable: output_variable})
        selected.attrs.update(source_variable=variable, output_variable=output_variable)
        variable = output_variable
    selected.attrs = netcdf_attributes(selected.attrs)
    for name in selected.variables:
        selected[name].attrs = netcdf_attributes(selected[name].attrs)
        # Biomass CRS is a scalar string with a provider '<U' placeholder
        # encoding. Let xarray choose a real NetCDF string representation.
        if selected[name].dtype.kind in ('U', 'O'):
            selected[name].encoding = {key: value for key, value in selected[name].encoding.items() if key != 'dtype'}
    encoding = {key: value for key, value in selected[variable].encoding.items()
                if key in {'dtype', '_FillValue', 'scale_factor', 'add_offset'}}
    encoding.update(zlib=True, complevel=4)
    selected.to_netcdf(path, engine='netcdf4', encoding={variable: encoding})


def main(dataset_id, variable, version, folder, cadence, earliest, argv=None, *, store_id='esa-cci', output_variable=None, chunked=False):
    parser = ArgumentParser(description=f'Download {variable} v{version}: one NetCDF per {"year" if cadence == "annual" else "month"}.')
    parser.add_argument('--start-date', type=iso_date, default=iso_date(earliest))
    parser.add_argument('--end-date', type=iso_date, help='Inclusive end date; defaults to all available coordinates.')
    parser.add_argument('--output-dir', type=Path, default=DOWNLOAD_ROOT / folder / f'v{version}')
    parser.add_argument('--bbox', nargs=4, type=float, metavar=('WEST', 'SOUTH', 'EAST', 'NORTH'), help='Optional spatial subset for testing/smaller downloads.')
    parser.add_argument('--max-files', type=positive_int, help='Limit selected files, useful for a small first run.')
    parser.add_argument('--dry-run', action='store_true', help='Discover coordinates and print planned files; do not load climate variables or write files.')
    parser.add_argument('--overwrite', action='store_true', help='Replace files in a matching managed output directory; otherwise valid files are skipped.')
    if chunked:
        parser.add_argument('--chunk-size', type=positive_int, help='Maximum spatial checkpoint side length; defaults to native Toolbox chunks.')
        parser.add_argument('--chunk-retries', type=positive_int, default=3, help='Attempts per remote block before stopping; successful blocks are retained (default: 3).')
        parser.add_argument('--keep-chunks', action='store_true', help='Keep checkpoints even after the annual NetCDF is successfully published.')
    args = parser.parse_args(argv)
    try:
        if chunked and args.chunk_retries > 10:
            raise ValueError('--chunk-retries must be between 1 and 10.')
        if args.end_date and args.end_date < args.start_date:
            raise ValueError('--end-date must not be before --start-date.')
        if args.start_date < iso_date(earliest):
            raise ValueError(f'This downloader supports this product from {earliest}; earlier dates require a different product.')
        if args.bbox:
            west, south, east, north = args.bbox
            if not all(math.isfinite(value) for value in args.bbox) or not (-180 <= west < east <= 180 and -90 <= south < north <= 90):
                raise ValueError('--bbox must be finite WEST SOUTH EAST NORTH with west < east and south < north.')
        identity = {'dataset_id': dataset_id, 'version': version, 'variable': variable,
                    'sampling': cadence, 'bbox': args.bbox}
        if store_id != 'esa-cci':
            identity['store_id'] = store_id
        if output_variable and output_variable != variable:
            identity['output_variable'] = output_variable
        prepare_output(args.output_dir, identity, dry_run=True)
        store = get_store() if store_id == 'esa-cci' else get_store(store_id)
        metadata = store.describe_data(dataset_id).to_dict()
        if version_key(metadata.get('attrs', {}).get('product_version', '')) != version_key(version):
            raise ValueError('The provider metadata does not confirm the requested product version.')
        if variable not in metadata.get('data_vars', {}):
            raise ValueError(f'{variable} is not present in the selected dataset.')
        variables = [variable]
        mapping = metadata['data_vars'][variable].get('attrs', {}).get('grid_mapping')
        if mapping in metadata['data_vars'] and mapping not in variables:
            variables.append(mapping)
        params = {'variable_names': variables, 'time_range': [
            args.start_date.isoformat(),
            (args.end_date.isoformat() if args.end_date else metadata['time_range'][1]),
        ]}
        if args.bbox:
            params['bbox'] = args.bbox
        dataset = (open_zarr_dataset(store, dataset_id, variables, args.bbox)
                   if store_id == 'esa-cci-zarr' else open_dataset(store, dataset_id, params))
        try:
            selected = select_timestamps(dataset.time.values, args.start_date, args.end_date, cadence)
            if args.max_files:
                selected = selected[:args.max_files]
            if not selected:
                raise ValueError('No timestamps found in the requested date range.')
            print(f'{dataset_id}\n{len(selected)} file(s) -> {args.output_dir}', flush=True)
            exporter = None
            lock = nullcontext()
            if chunked and not args.dry_run:
                from toolbox_chunk_cache import ChunkedExporter, output_lock
                args.output_dir.mkdir(parents=True, exist_ok=True)
                lock = output_lock(args.output_dir)
                exporter = ChunkedExporter(args.output_dir, size=args.chunk_size,
                                           retries=args.chunk_retries, keep_chunks=args.keep_chunks)
            with lock:
                prepare_output(args.output_dir, identity, dry_run=args.dry_run)
                written = skipped = 0
                for index, instant in selected:
                    output = args.output_dir / f'{instant:%Y%m%d}.nc'
                    if args.dry_run:
                        print(f'PLAN {instant.isoformat()} -> {output}', flush=True)
                        continue
                    if output.exists() and not args.overwrite:
                        if not validate_existing(output, output_variable or variable, dataset_id, instant):
                            raise ValueError(f'{output} is incomplete or has different provenance; inspect it or use --overwrite.')
                        print(f'SKIP {output}', flush=True)
                        skipped += 1
                        continue
                    print(f'DOWNLOAD {instant.isoformat()} -> {output}', flush=True)
                    export_options = {'output_variable': output_variable} if output_variable else {}
                    write = exporter or export_slice
                    atomic_write(output, lambda temporary, index=index: write(
                        dataset, index, variable, metadata, dataset_id, cadence, temporary, **export_options
                    ), overwrite=args.overwrite)
                    if exporter:
                        exporter.complete(output)
                    written += 1
                print(f'Finished: {written} written, {skipped} skipped' + (' (dry run)' if args.dry_run else ''), flush=True)
        finally:
            dataset.close()
    except KeyboardInterrupt:
        message = ('Interrupted; completed files and spatial checkpoints are retained. Rerun to resume.'
                   if chunked else 'Interrupted; completed files are retained and partial files are removed.')
        print(message, file=sys.stderr)
        return 130
    except Exception as error:
        print(f'Download failed: {error}', file=sys.stderr)
        if chunked:
            print('Successful spatial checkpoints are retained; rerun with the same output directory and chunk settings to resume.', file=sys.stderr)
        return 1
    return 0
