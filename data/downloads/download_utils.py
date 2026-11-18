"""Small shared helpers for version-isolated, resumable climate downloads."""

from datetime import date, datetime, timezone
import json
import os
from pathlib import Path
import tempfile


DOWNLOAD_ROOT = Path(__file__).resolve().parents[2] / 'download'


def iso_date(value):
    try:
        return date.fromisoformat(value)
    except ValueError as error:
        raise ValueError(f'Invalid date {value!r}; use YYYY-MM-DD.') from error


def positive_int(value):
    number = int(value)
    if number < 1:
        raise ValueError('Expected a positive integer.')
    return number


def timestamp(value):
    # numpy.datetime64 may be expressed in seconds, microseconds or nanoseconds.
    # Parse its ISO representation rather than assuming integer nanoseconds.
    result = datetime.fromisoformat(str(value).replace('Z', '+00:00'))
    return result.astimezone(timezone.utc).replace(tzinfo=None) if result.tzinfo else result


def atomic_write(destination, writer, overwrite=False):
    """Publish only complete files; failed/interrupted writes leave no final file."""
    destination = Path(destination)
    descriptor, temporary = tempfile.mkstemp(prefix=f'.{destination.name}.', suffix='.part', dir=destination.parent)
    os.close(descriptor)
    temporary = Path(temporary)
    try:
        writer(temporary)
        if temporary.stat().st_size == 0:
            raise ValueError(f'Refusing to publish an empty file: {destination}')
        if overwrite:
            os.replace(temporary, destination)
        else:
            # Unlike replace(), this cannot clobber a file created concurrently.
            os.link(temporary, destination)
    finally:
        temporary.unlink(missing_ok=True)


def prepare_output(directory, identity, dry_run=False):
    """Never mix releases or spatial subsets in one output directory."""
    directory = Path(directory)
    manifest = directory / 'download-manifest.json'
    if manifest.exists():
        if json.loads(manifest.read_text(encoding='utf-8')) != identity:
            raise ValueError(f'{directory} belongs to another dataset/sampling/grid. Choose a new --output-dir.')
    elif directory.exists() and any(directory.glob('*.nc')):
        raise ValueError(f'{directory} contains untracked NetCDF files. Choose a new empty --output-dir; existing data will not be overwritten.')
    if not dry_run:
        directory.mkdir(parents=True, exist_ok=True)
        if not manifest.exists():
            atomic_write(manifest, lambda path: path.write_text(json.dumps(identity, indent=2) + '\n', encoding='utf-8'))


def is_netcdf(path, expected_size=None):
    path = Path(path)
    if not path.is_file() or path.stat().st_size == 0:
        return False
    if expected_size is not None and path.stat().st_size != expected_size:
        return False
    with path.open('rb') as stream:
        magic = stream.read(8)
    return magic[:4] in (b'CDF\x01', b'CDF\x02', b'CDF\x05') or magic == b'\x89HDF\r\n\x1a\n'
