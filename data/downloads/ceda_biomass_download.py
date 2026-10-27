"""Download audited Biomass v7.0 MERGED 100 m annual NetCDFs from CEDA.

Preserve the original compressed files, with progress, checksum verification and
HTTP Range resume. No Toolbox climate-data reads or global re-encoding.
"""

from argparse import ArgumentParser
from contextlib import contextmanager
from datetime import date
import fcntl
import hashlib
from http.client import IncompleteRead
import json
import math
import os
from pathlib import Path
import re
import shutil
import sys
import time
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from download_utils import DOWNLOAD_ROOT, atomic_write, iso_date, is_netcdf, positive_int, prepare_output
from toolbox_download import version_key


VERSION = '7.0'
DATASET_ID = 'esacci.BIOMASS.yr.L4.AGB.multi-sensor.multi-platform.MERGED.7-0.100m'
ARCHIVE_PATH = '/neodc/esacci/biomass/data/agb/maps/v7.0/netcdf'
YEARS = tuple(range(2005, 2013)) + tuple(range(2015, 2025))
FILE_NAME = re.compile(r'ESACCI-BIOMASS-L4-AGB-MERGED-100m-(\d{4})-fv7\.0\.nc')
LEGACY_IDENTITY = {'dataset_id': DATASET_ID, 'version': VERSION, 'variable': 'agb',
                   'sampling': 'annual', 'bbox': None}
IDENTITY = dict(LEGACY_IDENTITY, transport='ceda-netcdf',
                archive_root='https://data.ceda.ac.uk' + ARCHIVE_PATH,
                representation='original-netcdf')
BLOCK_SIZE = 4 * 1024 * 1024


def request(url, timeout, headers=None):
    return urlopen(Request(url, headers={'User-Agent': 'esa-climate-from-space/biomass-download',
                                        'Accept-Encoding': 'identity', **(headers or {})}), timeout=timeout)


def discover_files(timeout):
    print('DISCOVER CEDA Biomass v7.0 MERGED 100 m annual files', flush=True)
    with request('https://data.ceda.ac.uk' + ARCHIVE_PATH + '/?json', timeout) as response:
        listing = json.load(response)
    if listing.get('path') != ARCHIVE_PATH or not isinstance(listing.get('items'), list):
        raise ValueError('Invalid CEDA Biomass directory listing.')
    entries = {}
    for item in listing['items']:
        match = FILE_NAME.fullmatch(item.get('name', ''))
        if not match:
            continue
        year = int(match[1])
        if year not in YEARS or year in entries:
            raise ValueError(f'Unexpected/duplicate v7.0 annual map: {year}')
        path = ARCHIVE_PATH + '/' + item['name']
        size, checksum = item.get('size'), item.get('md5')
        if item.get('path') != path or item.get('type') != 'file':
            raise ValueError('CEDA file path/type does not match the pinned product.')
        if type(size) is not int or size <= 0:
            raise ValueError(f'Invalid source size: {item["name"]}')
        # CEDA occasionally omits leading zeroes in hexadecimal MD5 strings.
        if not isinstance(checksum, str) or not re.fullmatch(r'[a-fA-F0-9]{1,32}', checksum):
            raise ValueError(f'Missing/invalid CEDA MD5 for {item["name"]}; refusing unverified transfer.')
        entries[year] = {'year': year, 'name': item['name'], 'size': size,
                         'md5': checksum.lower().zfill(32),
                         'url': 'https://dap.ceda.ac.uk' + path + '?download=1'}
    if set(entries) != set(YEARS):
        raise ValueError(f'CEDA is missing audited annual maps: {sorted(set(YEARS) - set(entries))}')
    return [entries[year] for year in YEARS]


def validate_metadata(path, year, *, legacy=False):
    """Read only small metadata/time coordinates, never the global AGB array."""
    import netCDF4
    try:
        with netCDF4.Dataset(path) as dataset:
            if version_key(getattr(dataset, 'product_version', '')) != version_key(VERSION):
                return False
            if 'agb' not in dataset.variables or 'time' not in dataset.variables:
                return False
            agb, instant = dataset.variables['agb'], dataset.variables['time']
            if (agb.dimensions != ('time', 'lat', 'lon') or agb.shape != (1, 157500, 405000)
                    or getattr(agb, 'units', '') != 'Mg/ha' or instant.size != 1):
                return False
            value = netCDF4.num2date(instant[:], instant.units,
                                    calendar=getattr(instant, 'calendar', 'standard'))[0]
            if (value.year, value.month, value.day) != (year, 1, 1):
                return False
            if legacy:
                return (getattr(dataset, 'source_dataset_id', '') == DATASET_ID
                        and getattr(dataset, 'output_sampling', '') == 'annual')
            return True
    except (OSError, ValueError, AttributeError, KeyError, IndexError):
        return False


def checksum_matches(path, entry):
    print(f'VERIFY {Path(path).name}: MD5 ({entry["size"] / 1e9:.2f} GB)', flush=True)
    digest = hashlib.md5()
    checked = 0
    last_report = time.monotonic()
    with Path(path).open('rb') as stream:
        while chunk := stream.read(BLOCK_SIZE):
            digest.update(chunk)
            checked += len(chunk)
            if time.monotonic() - last_report >= 5:
                print(f'  Verified {checked / 1e9:.2f} / {entry["size"] / 1e9:.2f} GB', flush=True)
                last_report = time.monotonic()
    return checked == entry['size'] and digest.hexdigest() == entry['md5']


def validate_existing(path, entry):
    # Compatible outputs from the former Toolbox exporter need not be discarded.
    if validate_metadata(path, entry['year'], legacy=True):
        return True
    return (is_netcdf(path, entry['size']) and checksum_matches(path, entry)
            and validate_metadata(path, entry['year']))


def prepare_biomass_output(directory, entries, dry_run):
    manifest = directory / 'download-manifest.json'
    if manifest.exists() and json.loads(manifest.read_text()) == LEGACY_IDENTITY:
        by_name = {f'{item["year"]}0101.nc': item for item in entries}
        for path in directory.glob('*.nc'):
            if path.name not in by_name or not validate_metadata(path, by_name[path.name]['year'], legacy=True):
                raise ValueError(f'Cannot adopt {path}; choose a new --output-dir. Existing files were not changed.')
        if dry_run:
            print('INFO: known Toolbox manifest will be backed up and migrated on the real run.', flush=True)
            return
        backup = directory / 'download-manifest.toolbox-backup.json'
        if backup.exists() and json.loads(backup.read_text()) != LEGACY_IDENTITY:
            raise ValueError('Existing Toolbox manifest backup differs; choose a new --output-dir.')
        if not backup.exists():
            atomic_write(backup, lambda path: path.write_text(json.dumps(LEGACY_IDENTITY, indent=2) + '\n'))
        atomic_write(manifest, lambda path: path.write_text(json.dumps(IDENTITY, indent=2) + '\n'), overwrite=True)
        print('Migrated known Toolbox manifest; completed outputs and old partials retained.', flush=True)
    prepare_output(directory, IDENTITY, dry_run=dry_run)


@contextmanager
def output_lock(directory):
    with (directory / '.biomass-download.lock').open('a+') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError as error:
            raise RuntimeError('Another CEDA Biomass downloader is using this output directory.') from error
        try:
            yield
        finally:
            fcntl.flock(lock, fcntl.LOCK_UN)


def partial_paths(destination):
    partial = destination.with_name('.' + destination.name + '.ceda.part')
    return partial, partial.with_name(partial.name + '.json')


def prepare_partial(destination, entry):
    partial, manifest = partial_paths(destination)
    if manifest.exists():
        if json.loads(manifest.read_text()) != entry:
            raise ValueError(f'Partial source identity changed: {manifest}; inspect it or choose a new --output-dir.')
    elif partial.exists():
        raise ValueError(f'Untracked partial file {partial}; refusing to append to unknown data.')
    else:
        atomic_write(manifest, lambda path: path.write_text(json.dumps(entry, indent=2) + '\n'))
    if partial.exists() and partial.stat().st_size > entry['size']:
        raise ValueError(f'Oversized partial file {partial}; inspect it before retrying.')
    return partial, manifest


def transfer(entry, partial, timeout):
    offset = partial.stat().st_size if partial.exists() else 0
    if offset == entry['size']:
        return
    print(f'{"RESUME" if offset else "DOWNLOAD"} {entry["name"]}: {offset / 1e9:.2f} / {entry["size"] / 1e9:.2f} GB', flush=True)
    with request(entry['url'], timeout, {'Range': f'bytes={offset}-'}) as response:
        if response.headers.get('Content-Encoding', 'identity').lower() != 'identity':
            raise ValueError('Unexpected compressed HTTP response; refusing unsafe byte-range resume.')
        if response.status == 206:
            match = re.fullmatch(r'bytes (\d+)-(\d+)/(\d+)', response.headers.get('Content-Range', ''))
            if not match or tuple(map(int, match.groups())) != (offset, entry['size'] - 1, entry['size']):
                raise ValueError('Invalid HTTP Content-Range; partial file was not changed.')
        elif response.status == 200:
            if offset:
                print('  Server ignored Range; restarting this tracked partial safely.', flush=True)
                offset = 0
        else:
            raise ValueError(f'Unexpected HTTP status: {response.status}')
        length = response.headers.get('Content-Length')
        if length is not None and int(length) != entry['size'] - offset:
            raise ValueError('HTTP Content-Length differs from the CEDA archive size.')
        received = offset
        started = last_report = time.monotonic()
        with partial.open('ab' if offset else 'wb') as stream:
            while chunk := response.read(BLOCK_SIZE):
                if received + len(chunk) > entry['size']:
                    raise ValueError('HTTP response exceeds the advertised source size.')
                stream.write(chunk)
                received += len(chunk)
                now = time.monotonic()
                if received == entry['size'] or now - last_report >= 5:
                    rate = (received - offset) / max(now - started, 0.001)
                    eta = (entry['size'] - received) / max(rate, 1)
                    print(f'  {received / 1e9:.2f} / {entry["size"] / 1e9:.2f} GB ({100 * received / entry["size"]:.1f}%) | {rate / 1e6:.1f} MB/s | ETA {eta / 60:.1f} min', flush=True)
                    last_report = now
        if received != entry['size']:
            raise IncompleteRead(b'', entry['size'] - received)


def download_file(entry, destination, timeout, retries, overwrite=False):
    partial, manifest = prepare_partial(destination, entry)
    for attempt in range(retries):
        try:
            transfer(entry, partial, timeout)
            break
        except (OSError, URLError, IncompleteRead) as error:
            if attempt + 1 == retries or (isinstance(error, HTTPError) and error.code not in (408, 429, 500, 502, 503, 504)):
                raise
            delay = min(2 ** (attempt + 1), 30)
            if isinstance(error, HTTPError):
                retry_after = error.headers.get('Retry-After', '')
                if retry_after.isdigit():
                    delay = max(delay, int(retry_after))
                error.close()
            print(f'  Transfer failed; resume attempt {attempt + 2}/{retries} in {delay}s: {error}', flush=True)
            time.sleep(delay)
    if not is_netcdf(partial, entry['size']) or not checksum_matches(partial, entry):
        raise ValueError(f'Source size/signature/MD5 verification failed. Retained {partial}; inspect it and its .json sidecar before removing both to restart.')
    if not validate_metadata(partial, entry['year']):
        raise ValueError(f'Source metadata does not confirm the requested v7.0 annual 100 m AGB map: {partial}')
    if overwrite:
        os.replace(partial, destination)
    else:
        os.link(partial, destination)  # Atomic publication without clobbering a concurrent file.
        partial.unlink()
    manifest.unlink()
    print(f'COMPLETED {destination.name}: {entry["size"] / 1e9:.2f} GB, original CEDA NetCDF', flush=True)


def main(argv=None):
    parser = ArgumentParser(description=__doc__)
    parser.add_argument('--start-date', type=iso_date, default=date(2005, 1, 1))
    parser.add_argument('--end-date', type=iso_date, default=date(2024, 12, 31))
    parser.add_argument('--output-dir', type=Path, default=DOWNLOAD_ROOT / 'biomass-ceda/v7.0',
                        help='Separate from Toolbox exports/checkpoints (default: download/biomass-ceda/v7.0).')
    parser.add_argument('--max-files', type=positive_int, help='Limit selected files, including existing files skipped on resume.')
    parser.add_argument('--timeout', type=float, default=60, help='HTTP socket timeout in seconds, not a whole-file limit.')
    parser.add_argument('--retries', type=positive_int, default=3)
    parser.add_argument('--dry-run', action='store_true', help='List source URLs/sizes; no NetCDF downloads or output changes.')
    parser.add_argument('--overwrite', action='store_true', help='Replace completed files only after verifying their replacements.')
    parser.add_argument('--bbox', nargs=4, type=float, help='Not supported by direct full-file downloads; rejected without transferring data.')
    args = parser.parse_args(argv)
    try:
        if args.bbox is not None:
            raise ValueError('--bbox is not supported by direct CEDA full-file downloads. Use a separate Toolbox regional workflow; no global download was started.')
        if not date(2005, 1, 1) <= args.start_date <= args.end_date <= date(2024, 12, 31):
            raise ValueError('Use a date range within the audited 2005-01-01 through 2024-12-31 coverage.')
        if not math.isfinite(args.timeout) or args.timeout <= 0 or args.retries > 10:
            raise ValueError('--timeout must be finite/positive; --retries must be between 1 and 10.')
        # Fail incompatible output identities before contacting CEDA.
        manifest = args.output_dir / 'download-manifest.json'
        if not manifest.exists() or json.loads(manifest.read_text()) != LEGACY_IDENTITY:
            prepare_output(args.output_dir, IDENTITY, dry_run=True)
        entries = discover_files(args.timeout)
        prepare_biomass_output(args.output_dir, entries, dry_run=True)
        selected = [item for item in entries if args.start_date <= date(item['year'], 1, 1) <= args.end_date]
        if args.max_files:
            selected = selected[:args.max_files]
        if not selected:
            raise ValueError('No annual maps fall inside the requested dates (no 2013/2014 maps exist).')
        total = sum(item['size'] for item in selected)
        print(f'Biomass v7.0 MERGED 100 m: {len(selected)} annual file(s), {total / 1e9:.2f} GB original sources -> {args.output_dir}\nStop any old Toolbox Biomass downloader before using this directory.', flush=True)
        if args.dry_run:
            for item in selected:
                print(f'PLAN {item["year"]}0101.nc: {item["size"] / 1e9:.2f} GB\n  {item["url"]}', flush=True)
            print('Dry run: no NetCDF downloads or output changes.', flush=True)
            return 0
        import netCDF4  # Fail before large transfers if the validation dependency is missing.
        args.output_dir.mkdir(parents=True, exist_ok=True)
        with output_lock(args.output_dir):
            prepare_biomass_output(args.output_dir, entries, dry_run=False)
            free = shutil.disk_usage(args.output_dir).free
            print(f'Free disk: {free / 1e9:.1f} GB; other downloads may use this disk concurrently.', flush=True)
            if total + 1024 ** 3 > free:
                print('WARNING: selected source total exceeds free space plus safety reserve; use --max-files or another --output-dir. Completed files may already be present.', flush=True)
            written = skipped = 0
            for item in selected:
                destination = args.output_dir / f'{item["year"]}0101.nc'
                if destination.exists() and not args.overwrite:
                    if not validate_existing(destination, item):
                        raise ValueError(f'Invalid existing {destination}; inspect it or use --overwrite.')
                    print(f'SKIP {destination.name}', flush=True)
                    skipped += 1
                    continue
                partial, _ = partial_paths(destination)
                remaining = item['size'] - (partial.stat().st_size if partial.exists() else 0)
                if max(0, remaining) + 1024 ** 3 > shutil.disk_usage(args.output_dir).free:
                    raise ValueError('Insufficient free disk for the next file plus a 1 GiB reserve. Existing files/partials retained; free space or use another --output-dir.')
                download_file(item, destination, args.timeout, args.retries, overwrite=args.overwrite)
                written += 1
            print(f'Finished: {written} written, {skipped} skipped.', flush=True)
    except KeyboardInterrupt:
        print('Interrupted; completed files and tracked partials retained. Rerun the same command to resume.', file=sys.stderr)
        return 130
    except Exception as error:
        print(f'Download failed: {error}\nCompleted files and tracked partials are retained; rerun to resume transient failures.', file=sys.stderr)
        return 1
    return 0
