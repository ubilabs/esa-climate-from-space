"""Checkpoint spatial Toolbox reads before assembling an annual NetCDF locally."""

from contextlib import contextmanager
import fcntl
import hashlib
import json
import math
import os
from pathlib import Path
import time
import zipfile
import zlib

from download_utils import atomic_write, timestamp


@contextmanager
def output_lock(directory):
    # Share the lock with the separate direct-CEDA biomass downloader.
    with (Path(directory) / '.biomass-download.lock').open('a+') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError as error:
            raise RuntimeError('Another biomass downloader is using this output directory.') from error
        try:
            yield
        finally:
            fcntl.flock(lock, fcntl.LOCK_UN)


def json_safe(value):
    if isinstance(value, dict):
        return {str(key): json_safe(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [json_safe(item) for item in value]
    if hasattr(value, 'tolist'):
        return json_safe(value.tolist())
    if isinstance(value, float) and not math.isfinite(value):
        return str(value)
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    return str(value)


def fingerprint(identity):
    return hashlib.sha256(json.dumps(identity, sort_keys=True, allow_nan=False).encode()).hexdigest()


def chunk_shape(variable, limit=None):
    preferred = variable.encoding.get('preferred_chunks', {})
    encoded = variable.encoding.get('chunks') or variable.encoding.get('chunksizes')
    shape = []
    for dimension in ('lat', 'lon'):
        size = preferred.get(dimension)
        if not size and encoded and len(encoded) == variable.ndim:
            size = encoded[variable.dims.index(dimension)]
        # The tested native Biomass Toolbox chunks are 1875 x 1875 cells.
        size = int(size or 1875)
        if limit:
            size = min(size, limit)
        shape.append(min(size, variable.sizes[dimension]))
    return tuple(shape)


def windows(height, width, chunks):
    for row in range(0, height, chunks[0]):
        for column in range(0, width, chunks[1]):
            yield (row, min(row + chunks[0], height), column, min(column + chunks[1], width))


def chunk_path(directory, window):
    return directory / f'{window[0]:09d}-{window[2]:09d}.npz'


def read_chunk(path, key, window, dtype):
    import numpy as np
    if path.is_symlink():
        raise ValueError(f'Refusing a symlink in the chunk cache: {path}')
    # Reading every member checks the ZIP CRCs; allow_pickle=False rejects objects.
    with np.load(path, allow_pickle=False) as stored:
        if set(stored.files) != {'data', 'key', 'window'}:
            raise ValueError('Unexpected chunk cache contents.')
        if str(stored['key'].item()) != key or stored['window'].tolist() != list(window):
            raise ValueError('Chunk belongs to another source, grid or spatial window.')
        data = stored['data']
    expected = (1, window[1] - window[0], window[3] - window[2])
    if data.shape != expected or data.dtype != dtype:
        raise ValueError('Chunk shape or dtype differs from its manifest.')
    return data


def read_remote_block(dataset, variable, index, window):
    import dask
    import numpy as np
    # No global .values/.load(): materialize only this spatial block, sequentially.
    with dask.config.set(scheduler='synchronous'):
        return np.asarray(dataset[variable].isel(
            time=slice(index, index + 1),
            lat=slice(window[0], window[1]), lon=slice(window[2], window[3])
        ).values)


def write_chunk(path, values, key, window):
    import numpy as np

    def write(temporary):
        with temporary.open('wb') as stream:
            np.savez_compressed(stream, data=values, key=np.array(key), window=np.array(window))
            stream.flush()
            os.fsync(stream.fileno())

    # A complete new checkpoint replaces a known corrupt checkpoint atomically.
    atomic_write(path, write, overwrite=True)


class ChunkedExporter:
    def __init__(self, directory, *, size=None, retries=3, keep_chunks=False):
        self.directory = Path(directory)
        self.size = size
        self.retries = retries
        self.keep_chunks = keep_chunks
        self._completed = None

    def identity(self, dataset, index, variable, dataset_id, cadence, chunks):
        import numpy as np
        data = dataset[variable]
        if data.dims != ('time', 'lat', 'lon'):
            raise ValueError('Chunked biomass export requires (time, lat, lon) dimensions.')
        if data.dtype.kind not in 'iuf':
            raise ValueError('Chunked biomass export requires numeric data.')
        coordinates = {}
        for name in ('lat', 'lon'):
            coordinate = np.asarray(dataset[name].values)
            if coordinate.ndim != 1 or not coordinate.size or not np.isfinite(coordinate).all():
                raise ValueError(f'Invalid {name} coordinate.')
            coordinates[name] = {
                'size': len(coordinate), 'dtype': coordinate.dtype.str,
                'sha256': hashlib.sha256(np.ascontiguousarray(coordinate).tobytes()).hexdigest()
            }
        return json_safe({
            'schema_version': 1, 'dataset_id': dataset_id, 'variable': variable,
            'timestamp': timestamp(dataset.time.values[index]).isoformat(), 'sampling': cadence,
            'shape': [1, data.sizes['lat'], data.sizes['lon']], 'dtype': data.dtype.str,
            'coordinates': coordinates, 'chunk_shape': chunks,
            'attributes': {name: data.attrs.get(name) for name in (
                'units', 'standard_name', 'grid_mapping', 'valid_min', 'valid_max', 'valid_range'
            )},
            'encoding': {name: data.encoding.get(name) for name in (
                'dtype', '_FillValue', 'scale_factor', 'add_offset'
            )}
        })

    def __call__(self, dataset, index, variable, metadata, dataset_id, cadence, path):
        import dask
        import dask.array as da
        from aiohttp import ClientError
        from dask import delayed
        from toolbox_download import export_slice, validate_existing

        self._completed = None
        data = dataset[variable]
        chunks = chunk_shape(data, self.size)
        identity = self.identity(dataset, index, variable, dataset_id, cadence, chunks)
        key = fingerprint(identity)
        stamp = timestamp(dataset.time.values[index]).strftime('%Y%m%d')
        cache = self.directory / '.chunks' / stamp
        manifest = cache / 'manifest.json'
        if manifest.exists():
            if json.loads(manifest.read_text()) != identity:
                raise ValueError(f'{cache} has a different source/grid/chunk plan. Restore the original settings or use another output directory.')
        else:
            if cache.exists() and any(cache.iterdir()):
                raise ValueError(f'{cache} contains untracked cache files; refusing to adopt them.')
            cache.mkdir(parents=True, exist_ok=True)
            atomic_write(manifest, lambda temporary: temporary.write_text(json.dumps(identity, indent=2) + '\n'))

        plan = list(windows(data.sizes['lat'], data.sizes['lon'], chunks))
        print(f'CHECKPOINTS {stamp}: {len(plan)} chunks ({chunks[0]} x {chunks[1]} cells), {cache}', flush=True)
        cached = downloaded = 0
        for number, window in enumerate(plan, 1):
            checkpoint = chunk_path(cache, window)
            if checkpoint.is_symlink():
                raise ValueError(f'Refusing a symlink in the chunk cache: {checkpoint}')
            reusable = False
            if checkpoint.exists():
                try:
                    read_chunk(checkpoint, key, window, data.dtype)
                    reusable = True
                except (OSError, ValueError, EOFError, KeyError, zipfile.BadZipFile, zlib.error):
                    print(f'INVALID CHUNK {number}/{len(plan)}: refetching this block only', flush=True)
            if reusable:
                cached += 1
            else:
                for attempt in range(1, self.retries + 1):
                    try:
                        values = read_remote_block(dataset, variable, index, window)
                        expected = (1, window[1] - window[0], window[3] - window[2])
                        if values.shape != expected or values.dtype != data.dtype:
                            raise ValueError('Toolbox returned an unexpected chunk shape/dtype.')
                        break
                    except (OSError, TimeoutError, ClientError) as error:
                        if attempt == self.retries:
                            raise
                        print(f'RETRY CHUNK {number}/{len(plan)} ({attempt}/{self.retries}): {error}', flush=True)
                        time.sleep(min(2 ** attempt, 30))
                write_chunk(checkpoint, values, key, window)
                del values
                downloaded += 1
            print(f'CHUNK {number}/{len(plan)} ({100 * number / len(plan):.1f}%): '
                  f'{"cached" if reusable else "downloaded"}; reused={cached}, new={downloaded}', flush=True)

        # Assemble from local checkpoints only, with bounded memory. Failure here
        # does not discard the remote reads and requires no pixel re-download.
        rows = []
        row = []
        previous_row = None
        for window in plan:
            if previous_row is not None and window[0] != previous_row:
                rows.append(da.concatenate(row, axis=2))
                row = []
            previous_row = window[0]
            shape = (1, window[1] - window[0], window[3] - window[2])
            row.append(da.from_delayed(
                delayed(read_chunk)(chunk_path(cache, window), key, window, data.dtype),
                shape=shape, dtype=data.dtype
            ))
        rows.append(da.concatenate(row, axis=2))
        local = dataset.isel(time=[index]).copy(deep=False)
        local[variable] = local[variable].copy(data=da.concatenate(rows, axis=1))
        local.attrs = dict(local.attrs, chunk_cache_fingerprint=key)
        print(f'ASSEMBLE {stamp}: writing annual NetCDF from local chunks only', flush=True)
        with dask.config.set(scheduler='synchronous'):
            export_slice(local, 0, variable, metadata, dataset_id, cadence, path)
        if not validate_existing(path, variable, dataset_id, timestamp(dataset.time.values[index])):
            raise ValueError('Assembled NetCDF failed provenance/timestamp validation; chunks retained.')
        with Path(path).open('rb') as stream:
            os.fsync(stream.fileno())
        self._completed = (cache, manifest, plan)

    def complete(self, destination):
        """Called only after atomic publication of the complete annual NetCDF."""
        if self._completed is None:
            return
        cache, manifest, plan = self._completed
        self._completed = None
        if self.keep_chunks:
            print(f'RETAINED CHUNKS {cache}', flush=True)
            return
        import xarray as xr
        identity = json.loads(manifest.read_text())
        with xr.open_dataset(destination) as published:
            if (published.attrs.get('chunk_cache_fingerprint') != fingerprint(identity)
                    or list(published[identity['variable']].shape) != identity['shape']):
                raise ValueError('Published NetCDF does not match the checkpoint cache; chunks retained.')
        # Only remove known checkpoints owned by this export, never broad paths.
        for window in plan:
            chunk_path(cache, window).unlink()
        manifest.unlink()
        if not any(cache.iterdir()):
            cache.rmdir()
        print(f'COMPLETE {destination}: checkpoints removed after successful publication', flush=True)
