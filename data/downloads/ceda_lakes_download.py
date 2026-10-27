"""Download audited Lakes v3.0.0 monthly snapshots from CEDA's daily NetCDFs.

No Zarr pixel reads: stream one daily file, copy only LSWT and its coordinates,
then discard the verified source cache after publishing the output atomically.
"""

from argparse import ArgumentParser
from contextlib import contextmanager
from datetime import date
import fcntl
import hashlib
import itertools
import json
import math
from pathlib import Path
import re
import sys
import time
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

from download_utils import DOWNLOAD_ROOT, atomic_write, iso_date, is_netcdf, positive_int, prepare_output
from toolbox_download import netcdf_attributes, version_key


VERSION = '3.0.0'
VARIABLE = 'lake_surface_water_temperature'
OUTPUT_VARIABLE = 'lswt'
DATASET_ID = 'esacci.LAKES.day.L3S.LK_PRODUCTS.multi-sensor.multi-platform.MERGED.v3-0-0.r1'
REFERENCE_ID = 'ESACCI-LAKES-L3S-LK_PRODUCTS-MERGED-fv3.0.0.zarr'
ARCHIVE_PATH = '/neodc/esacci/lakes/data/lake_products/L3S/v3.0/merged_product'
FIRST_DATE = date(1995, 6, 1)
LAST_DATE = date(2023, 12, 31)
FILE_NAME = re.compile(r'ESACCI-LAKES-L3S-LK_PRODUCTS-MERGED-(\d{8})-fv3\.0\.0\.nc')


def request(url, timeout):
    return urlopen(Request(url, headers={'User-Agent': 'esa-climate-from-space/lakes-download'}), timeout=timeout)


def monthly_files(start, end, timeout):
    year, month = start.year, start.month
    while (year, month) <= (end.year, end.month):
        path = f'{ARCHIVE_PATH}/{year}/{month:02d}'
        print(f'DISCOVER {year}-{month:02d}', flush=True)
        with request('https://data.ceda.ac.uk' + path + '/?json', timeout) as response:
            listing = json.load(response)
        if listing.get('path') != path or not isinstance(listing.get('items'), list):
            raise ValueError(f'Invalid CEDA directory listing: {path}')
        candidates = []
        for item in listing['items']:
            match = FILE_NAME.fullmatch(item.get('name', ''))
            if not match:
                continue
            stamp = iso_date(f'{match[1][:4]}-{match[1][4:6]}-{match[1][6:8]}')
            if (stamp.year, stamp.month) != (year, month) or item.get('path') != path + '/' + item['name']:
                raise ValueError('CEDA file date/path does not match its monthly directory.')
            size = item.get('size')
            if not isinstance(size, int) or size <= 0:
                raise ValueError(f'No valid byte size for {item["name"]}')
            checksum = item.get('md5')
            if checksum:
                if not isinstance(checksum, str) or not re.fullmatch(r'[a-fA-F0-9]{1,32}', checksum):
                    raise ValueError('Invalid CEDA MD5 metadata.')
                checksum = checksum.lower().zfill(32)
            candidates.append({'date': stamp, 'path': item['path'], 'name': item['name'],
                               'size': size, 'md5': checksum,
                               'url': 'https://dap.ceda.ac.uk' + quote(item['path'], safe='/') + '?download=1'})
        if not candidates:
            raise ValueError(f'No v{VERSION} daily files found for {year}-{month:02d}; refusing to invent/skip coverage.')
        # Keep one canonical snapshot per calendar month, even for partial ranges.
        selected = min(candidates, key=lambda item: (item['date'], item['name']))
        if start <= selected['date'] <= end:
            yield selected
        year, month = (year + 1, 1) if month == 12 else (year, month + 1)


def validate_source(path, entry):
    if not is_netcdf(path, entry['size']):
        return False
    if entry['md5']:
        digest = hashlib.md5()
        with Path(path).open('rb') as stream:
            while chunk := stream.read(1024 * 1024):
                digest.update(chunk)
        return digest.hexdigest() == entry['md5']
    return True


def download_source(entry, destination, timeout, retries, overwrite=False):
    if destination.exists() and not overwrite:
        if validate_source(destination, entry):
            print(f'CACHE {entry["name"]} ({entry["size"] / 1e6:.1f} MB)', flush=True)
            return
        raise ValueError(f'Invalid cached source {destination}; inspect it or use --overwrite.')
    for attempt in range(retries):
        try:
            print(f'DOWNLOAD {entry["name"]}: {entry["size"] / 1e6:.1f} MB', flush=True)
            def write(temporary):
                received = 0
                last_report = time.monotonic()
                with request(entry['url'], timeout) as response, temporary.open('wb') as stream:
                    while chunk := response.read(1024 * 1024):
                        stream.write(chunk)
                        received += len(chunk)
                        if received > entry['size']:
                            raise ValueError('Source response exceeds the advertised NetCDF size.')
                        if time.monotonic() - last_report >= 5:
                            print(f'  {received / 1e6:.1f} / {entry["size"] / 1e6:.1f} MB', flush=True)
                            last_report = time.monotonic()
                if not validate_source(temporary, entry):
                    raise ValueError('Source byte count, NetCDF signature or MD5 verification failed.')
            atomic_write(destination, write, overwrite=overwrite)
            print(f'  Verified {entry["size"] / 1e6:.1f} MB', flush=True)
            return
        except (OSError, URLError) as error:
            if attempt + 1 == retries or (isinstance(error, HTTPError) and error.code not in (429, 500, 502, 503, 504)):
                raise
            delay = min(2 ** (attempt + 1), 30)
            if isinstance(error, HTTPError):
                retry_after = error.headers.get('Retry-After', '')
                if retry_after.isdigit():
                    delay = max(delay, int(retry_after))
                error.close()
            print(f'  Transfer failed; retry {attempt + 2}/{retries} in {delay}s: {error}', flush=True)
            time.sleep(delay)


def source_date(dataset):
    import netCDF4
    if 'time' not in dataset.variables or dataset.variables['time'].size != 1:
        raise ValueError('Expected exactly one daily source timestamp.')
    variable = dataset.variables['time']
    value = netCDF4.num2date(variable[:], variable.units, calendar=getattr(variable, 'calendar', 'standard'))[0]
    return date(value.year, value.month, value.day)


def validate_output(path, stamp):
    import netCDF4
    try:
        with netCDF4.Dataset(path) as dataset:
            return (OUTPUT_VARIABLE in dataset.variables
                    and version_key(getattr(dataset, 'product_version', '')) == version_key(VERSION)
                    and getattr(dataset, 'source_dataset_id', '') in (DATASET_ID, REFERENCE_ID)
                    and getattr(dataset, 'output_sampling', '') == 'monthly'
                    and getattr(dataset.variables[OUTPUT_VARIABLE], 'units', '').lower() in ('k', 'kelvin')
                    and source_date(dataset) == stamp)
    except (OSError, ValueError, AttributeError, KeyError):
        return False


def extract_lswt(source, destination, entry, bbox=None, block_size=512):
    """Copy packed values in bounded spatial blocks; never decode a global cube."""
    import netCDF4
    import numpy as np
    with netCDF4.Dataset(source) as src:
        if version_key(getattr(src, 'product_version', '')) != version_key(VERSION):
            raise ValueError('Daily source metadata does not confirm Lakes v3.0.0.')
        if VARIABLE not in src.variables or source_date(src) != entry['date']:
            raise ValueError('Daily source variable/timestamp does not match the requested snapshot.')
        temperature = src.variables[VARIABLE]
        if temperature.dimensions != ('time', 'lat', 'lon') or getattr(temperature, 'units', '').lower() not in ('k', 'kelvin'):
            raise ValueError('Unexpected LSWT dimensions/units; refusing to guess a conversion.')
        windows = {'time': slice(0, 1)}
        for name, limits in [('lat', (bbox[1], bbox[3]) if bbox else None),
                             ('lon', (bbox[0], bbox[2]) if bbox else None)]:
            coordinate = np.asarray(src.variables[name][:])
            if coordinate.ndim != 1 or not np.all(np.isfinite(coordinate)):
                raise ValueError(f'Invalid {name} coordinate.')
            positions = np.flatnonzero((coordinate >= limits[0]) & (coordinate <= limits[1])) if limits else np.arange(len(coordinate))
            if not positions.size or (positions.size > 1 and not np.all(np.diff(positions) == 1)):
                raise ValueError('Bounding box has no contiguous grid-cell centres; use a wider --bbox.')
            windows[name] = slice(int(positions[0]), int(positions[-1]) + 1)
        names = {VARIABLE, 'time', 'lat', 'lon'}
        mapping = getattr(temperature, 'grid_mapping', None)
        if mapping:
            if mapping not in src.variables:
                raise ValueError('Source CRS reference is missing.')
            names.add(mapping)
        for name in list(names):
            bounds = getattr(src.variables[name], 'bounds', None)
            if bounds:
                if bounds not in src.variables:
                    raise ValueError(f'Source coordinate bounds are missing: {bounds}')
                names.add(bounds)
        dimensions = {dim for name in names for dim in src.variables[name].dimensions}
        height = windows['lat'].stop - windows['lat'].start
        width = windows['lon'].stop - windows['lon'].start
        print(f'EXTRACT {height} x {width} cells; packed spatial blocks, no Zarr reads', flush=True)
        with netCDF4.Dataset(destination, 'w', format='NETCDF4') as dst:
            attrs = {key: src.getncattr(key) for key in src.ncattrs()
                     if key not in {'_NCProperties', '_IsNetcdf4', '_SuperblockVersion'}}
            attrs.update(source_dataset_id=DATASET_ID, source_reference_dataset_id=REFERENCE_ID,
                         source_url=entry['url'], download_transport='ceda-netcdf',
                         source_variable=VARIABLE, output_variable=OUTPUT_VARIABLE, output_sampling='monthly')
            dst.setncatts(netcdf_attributes(attrs))
            for name in dimensions:
                length = windows[name].stop - windows[name].start if name in windows else len(src.dimensions[name])
                dst.createDimension(name, length)
            for name in sorted(names):
                original = src.variables[name]
                original.set_auto_maskandscale(False)
                attributes = {key: original.getncattr(key) for key in original.ncattrs() if key != '_FillValue'}
                if 'ancillary_variables' in attributes:
                    retained = [item for item in attributes['ancillary_variables'].split() if item in names]
                    if retained:
                        attributes['ancillary_variables'] = ' '.join(retained)
                    else:
                        attributes.pop('ancillary_variables')
                options = {}
                if '_FillValue' in original.ncattrs():
                    options['fill_value'] = original.getncattr('_FillValue')
                if name == VARIABLE:
                    options.update(zlib=True, complevel=4, chunksizes=(1, min(block_size, height), min(block_size, width)))
                target = dst.createVariable(OUTPUT_VARIABLE if name == VARIABLE else name,
                                            original.datatype, original.dimensions, **options)
                target.setncatts(netcdf_attributes(attributes))
                target.set_auto_maskandscale(False)  # Preserve raw packing codes/scale/offset exactly.
                if name != VARIABLE:
                    index = tuple(windows.get(dim, slice(None)) for dim in original.dimensions)
                    target[...] = original[index] if index else original[...]
                    continue
                fill = options.get('fill_value')
                total = math.ceil(height / block_size) * math.ceil(width / block_size)
                done = 0
                last_report = time.monotonic()
                for y in range(0, height, block_size):
                    for x in range(0, width, block_size):
                        y_stop, x_stop = min(y + block_size, height), min(x + block_size, width)
                        data = original[0:1, windows['lat'].start + y:windows['lat'].start + y_stop,
                                        windows['lon'].start + x:windows['lon'].start + x_stop]
                        empty = fill is not None and (np.all(np.isnan(data)) if np.issubdtype(type(fill), np.floating) and np.isnan(fill) else np.all(data == fill))
                        if not empty:
                            target[0:1, y:y_stop, x:x_stop] = data
                        done += 1
                        if done == total or time.monotonic() - last_report >= 5:
                            print(f'  Extracted {done}/{total} blocks ({100 * done / total:.1f}%)', flush=True)
                            last_report = time.monotonic()


def output_identity(bbox):
    return {'dataset_id': DATASET_ID, 'version': VERSION, 'variable': VARIABLE,
            'sampling': 'monthly', 'bbox': bbox, 'output_variable': OUTPUT_VARIABLE,
            'transport': 'ceda-netcdf', 'archive_root': 'https://data.ceda.ac.uk' + ARCHIVE_PATH,
            'reference_store_id': 'esa-cci-zarr', 'reference_dataset_id': REFERENCE_ID}


def prepare_lakes_output(directory, bbox, dry_run):
    manifest = directory / 'download-manifest.json'
    identity = output_identity(bbox)
    legacy = {'dataset_id': REFERENCE_ID, 'version': VERSION, 'variable': VARIABLE,
              'sampling': 'monthly', 'bbox': bbox, 'store_id': 'esa-cci-zarr', 'output_variable': OUTPUT_VARIABLE}
    if manifest.exists() and json.loads(manifest.read_text()) == legacy:
        # Only this exact known previous source is equivalent; never adopt an
        # arbitrary directory/version. Preserve its manifest and completed files.
        for path in directory.glob('*.nc'):
            if not re.fullmatch(r'\d{8}\.nc', path.name) or not validate_output(path, iso_date(f'{path.stem[:4]}-{path.stem[4:6]}-{path.stem[6:8]}')):
                raise ValueError(f'Cannot adopt incompatible existing file {path}; choose a new --output-dir.')
        if dry_run:
            print('INFO: the known old Zarr manifest will be backed up and migrated on the real run.', flush=True)
            return
        backup = directory / 'download-manifest.zarr-backup.json'
        if backup.exists() and json.loads(backup.read_text()) != legacy:
            raise ValueError('Existing Zarr manifest backup differs; choose a new --output-dir.')
        if not backup.exists():
            atomic_write(backup, lambda path: path.write_text(json.dumps(legacy, indent=2) + '\n'))
        atomic_write(manifest, lambda path: path.write_text(json.dumps(identity, indent=2) + '\n'), overwrite=True)
        print('Migrated the known Zarr manifest; completed files and partial files were retained.', flush=True)
    prepare_output(directory, identity, dry_run=dry_run)


@contextmanager
def output_lock(directory):
    with (directory / '.lakes-download.lock').open('a+') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError as error:
            raise RuntimeError('Another direct Lakes downloader is using this output directory.') from error
        try:
            yield
        finally:
            fcntl.flock(lock, fcntl.LOCK_UN)


def main(argv=None):
    parser = ArgumentParser(description=__doc__)
    parser.add_argument('--start-date', type=iso_date, default=FIRST_DATE)
    parser.add_argument('--end-date', type=iso_date, default=LAST_DATE)
    parser.add_argument('--output-dir', type=Path, default=DOWNLOAD_ROOT / 'lakes_lswt/v3.0.0')
    parser.add_argument('--bbox', nargs=4, type=float, metavar=('WEST', 'SOUTH', 'EAST', 'NORTH'), help='Subset the local daily file; the full compressed source is still transferred.')
    parser.add_argument('--max-files', type=positive_int)
    parser.add_argument('--timeout', type=float, default=60, help='HTTP socket timeout in seconds.')
    parser.add_argument('--retries', type=positive_int, default=3)
    parser.add_argument('--dry-run', action='store_true', help='Read directory listings and print planned URLs/sizes; no NetCDF downloads or output changes.')
    parser.add_argument('--overwrite', action='store_true')
    parser.add_argument('--keep-source', action='store_true', help='Retain verified original daily files in .source-cache instead of removing them after extraction.')
    args = parser.parse_args(argv)
    try:
        if not FIRST_DATE <= args.start_date <= args.end_date <= LAST_DATE:
            raise ValueError('Use a date range within 1995-06-01 through 2023-12-31 for this audited LSWT release.')
        if not math.isfinite(args.timeout) or args.timeout <= 0 or args.retries > 10:
            raise ValueError('--timeout must be finite/positive; --retries must be between 1 and 10.')
        if args.bbox:
            west, south, east, north = args.bbox
            if not all(math.isfinite(value) for value in args.bbox) or not (-180 <= west < east <= 180 and -90 <= south < north <= 90):
                raise ValueError('Invalid --bbox WEST SOUTH EAST NORTH.')
        prepare_lakes_output(args.output_dir, args.bbox, dry_run=True)
        entries = monthly_files(args.start_date, args.end_date, args.timeout)
        if args.max_files:
            entries = itertools.islice(entries, args.max_files)
        months = (args.end_date.year - args.start_date.year) * 12 + args.end_date.month - args.start_date.month + 1
        requested = min(months, args.max_files) if args.max_files else months
        print(f'Lakes v{VERSION}: direct CEDA NetCDF -> {args.output_dir}\nUp to {requested} monthly snapshot(s); output lswt in native Kelvin.\nStop any old Zarr downloader before using this directory.', flush=True)
        if args.dry_run:
            count = 0
            for entry in entries:
                count += 1
                print(f'PLAN {entry["date"]}: {entry["size"] / 1e6:.1f} MB source -> {entry["date"]:%Y%m%d}.nc\n  {entry["url"]}', flush=True)
            if not count:
                raise ValueError('No monthly snapshots fall inside the requested dates.')
            print(f'Dry run: {count} selected; no data downloaded or files changed.', flush=True)
            return 0
        args.output_dir.mkdir(parents=True, exist_ok=True)
        with output_lock(args.output_dir):
            prepare_lakes_output(args.output_dir, args.bbox, dry_run=False)
            partials = list(args.output_dir.glob('.*.part'))
            if partials:
                print(f'WARNING: {len(partials)} old partial file(s) retained and ignored; ensure the old process is stopped.', flush=True)
            cache = args.output_dir / '.source-cache'
            cache.mkdir(exist_ok=True)
            written = skipped = selected = 0
            for entry in entries:
                selected += 1
                destination = args.output_dir / f'{entry["date"]:%Y%m%d}.nc'
                if destination.exists() and not args.overwrite:
                    if not validate_output(destination, entry['date']):
                        raise ValueError(f'Invalid existing output {destination}; inspect it or use --overwrite.')
                    skipped += 1
                    print(f'SKIP {destination.name}', flush=True)
                    continue
                source = cache / entry['name']
                download_source(entry, source, args.timeout, args.retries, overwrite=args.overwrite)
                started = time.monotonic()
                atomic_write(destination, lambda temporary: extract_lswt(source, temporary, entry, args.bbox), overwrite=args.overwrite)
                written += 1
                print(f'COMPLETED {destination.name}: {destination.stat().st_size / 1e6:.1f} MB in {time.monotonic() - started:.1f}s', flush=True)
                if not args.keep_source:
                    source.unlink()
            if not selected:
                raise ValueError('No monthly snapshots fall inside the requested dates.')
            print(f'Finished: {written} written, {skipped} skipped.', flush=True)
    except KeyboardInterrupt:
        print('Interrupted; completed outputs and verified source cache are retained. Rerun to resume.', file=sys.stderr)
        return 130
    except Exception as error:
        print(f'Download failed: {error}', file=sys.stderr)
        return 1
    return 0
