"""Download Vegetation Parameters CCI v2.0 LAI from CEDA and merge the tiles per date.

CEDA provides 5-daily 10x10 degree tiles (1120 x 1120 px, ~1 km). For every
selected date this script downloads the tiles, mosaics their LAI band with
GDAL, converts the packed integers to physical values (m2/m2, float32, NaN as
no data) and writes one file per date: YYYYMMDD.nc.

By default every 3rd date is kept (one every 15 days), which matches the v1.0
layer. Finished dates are skipped, so an interrupted run can simply be resumed.

Requires GDAL command line tools (gdalbuildvrt, gdal_translate) on PATH.
"""

from argparse import ArgumentParser
from concurrent.futures import ThreadPoolExecutor
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.request

ARCHIVE_PATH = 'neodc/esacci/vegetation_parameters/data/L3S/vp_products/v2.0/tiles'
LIST_URL = f'https://data.ceda.ac.uk/{ARCHIVE_PATH}'
FILE_URL = f'https://dap.ceda.ac.uk/{ARCHIVE_PATH}'
FIRST_YEAR, LAST_YEAR = 2000, 2020
DOWNLOAD_ROOT = Path(__file__).resolve().parents[2] / 'download'

# Tile grid: lon_min = -180 + 10 * X, lat_max = 85 - 10 * Y.
# Default: the Europe/Africa transect (10-30 E, 55 S - 85 N) plus X18Y03
# (0-10 E, 45-55 N), the same area as the v1.0 layer. X09Y04 (eastern US,
# 90-80 W, 35-45 N) is left out because it would stretch the mosaic across the
# Atlantic; add it with --tiles if needed.
DEFAULT_TILES = ['X18Y03'] + [f'X{x}Y{y:02d}' for x in (19, 20) for y in range(14)]

FILE_PATTERN = re.compile(r'ESACCI-VEGETATION-L3S-VP_PRODUCTS-MERGED-tile_(X\d{2}Y\d{2})-(\d{8})-fv2\.0\.nc$')


def list_dir(path=''):
    url = f'{LIST_URL}/{path}?json' if path else f'{LIST_URL}?json'
    with urllib.request.urlopen(url, timeout=120) as response:
        return json.load(response)['items']


def download(url, destination, size):
    if destination.exists() and (not size or destination.stat().st_size == size):
        return
    partial = destination.with_suffix('.part')
    for attempt in range(3):
        try:
            with urllib.request.urlopen(url, timeout=300) as response, open(partial, 'wb') as file:
                shutil.copyfileobj(response, file)
            if size and partial.stat().st_size != size:
                raise OSError(f'incomplete download ({partial.stat().st_size} of {size} bytes)')
            partial.rename(destination)
            return
        except OSError as error:
            partial.unlink(missing_ok=True)
            if attempt == 2:
                raise OSError(f'{url}: {error}') from error


def run(command):
    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f'{command[0]} failed:\n{result.stderr.strip()}')


def merge(tile_files, output):
    """Mosaic the LAI band of all tiles and unpack it to float32 m2/m2."""
    with tempfile.TemporaryDirectory(dir=output.parent) as temporary:
        vrt = Path(temporary) / 'mosaic.vrt'
        merged = Path(temporary) / 'merged.nc'
        run(['gdalbuildvrt', '-q', str(vrt)] + [f'NETCDF:{path}:LAI' for path in tile_files])
        run(['gdal_translate', '-q', '-unscale', '-a_scale', '1', '-a_offset', '0',
             '-ot', 'Float32', '-a_nodata', 'nan', '-of', 'netCDF',
             '-co', 'FORMAT=NC4C', '-co', 'COMPRESS=DEFLATE', str(vrt), str(merged)])
        merged.rename(output)


def main():
    parser = ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument('--start-year', type=int, default=FIRST_YEAR)
    parser.add_argument('--end-year', type=int, default=LAST_YEAR)
    parser.add_argument('--every', type=int, default=3, help='Keep every n-th 5-daily date (default 3: one every 15 days).')
    parser.add_argument('--tiles', nargs='+', default=DEFAULT_TILES, help='Tiles to include (default: transect + X18Y03).')
    parser.add_argument('--output-dir', type=Path, default=DOWNLOAD_ROOT / 'vegetation-lai' / 'v2.0')
    parser.add_argument('--max-files', type=int, help='Stop after this many dates, useful for a first test.')
    parser.add_argument('--workers', type=int, default=8, help='Parallel tile downloads (default 8).')
    parser.add_argument('--keep-raw', action='store_true', help='Keep the downloaded tiles after merging.')
    parser.add_argument('--dry-run', action='store_true', help='List the planned dates without downloading.')
    args = parser.parse_args()

    for tool in ('gdalbuildvrt', 'gdal_translate'):
        if not args.dry_run and not shutil.which(tool):
            print(f'{tool} not found; install GDAL or run this in the cate Docker container.', file=sys.stderr)
            return 1

    args.output_dir.mkdir(parents=True, exist_ok=True)
    raw_root = args.output_dir / 'raw'
    done = 0
    try:
        for year in range(max(args.start_year, FIRST_YEAR), min(args.end_year, LAST_YEAR) + 1):
            available = {item['name'] for item in list_dir(str(year))}
            missing_tiles = sorted(set(args.tiles) - available)
            if missing_tiles:
                print(f'{year}: tiles not on CEDA, skipped: {" ".join(missing_tiles)}', file=sys.stderr)

            # date -> {tile: (url, size)}
            by_date = {}
            for tile in sorted(set(args.tiles) & available):
                for item in list_dir(f'{year}/{tile}'):
                    match = FILE_PATTERN.match(item['name'])
                    if match:
                        url = f'{FILE_URL}/{year}/{tile}/{item["name"]}'
                        by_date.setdefault(match.group(2), {})[tile] = (url, item.get('size'))

            selected = sorted(by_date)[::args.every]
            print(f'{year}: {len(selected)} of {len(by_date)} dates, {len(available & set(args.tiles))} tiles', flush=True)

            for day in selected:
                if args.max_files and done >= args.max_files:
                    return 0
                done += 1
                output = args.output_dir / f'{day}.nc'
                if args.dry_run:
                    print(f'PLAN {output.name} ({len(by_date[day])} tiles)', flush=True)
                    continue
                if output.exists():
                    print(f'SKIP {output.name}', flush=True)
                    continue
                tiles = by_date[day]
                lacking = sorted(set(args.tiles) & available - set(tiles))
                if lacking:
                    print(f'{day}: no data for {" ".join(lacking)}; merging the rest', file=sys.stderr)

                raw_dir = raw_root / day
                raw_dir.mkdir(parents=True, exist_ok=True)
                paths = [raw_dir / Path(url).name for url, _ in tiles.values()]
                with ThreadPoolExecutor(max_workers=args.workers) as pool:
                    list(pool.map(lambda job: download(*job),
                                  [(url, path, size) for (url, size), path in zip(tiles.values(), paths)]))

                merge(paths, output)
                if not args.keep_raw:
                    shutil.rmtree(raw_dir)
                print(f'DONE {output.name} ({len(paths)} tiles)', flush=True)
    except KeyboardInterrupt:
        print('Interrupted; finished dates are kept. Rerun to resume.', file=sys.stderr)
        return 130
    except (OSError, RuntimeError, ValueError) as error:
        print(f'Failed: {error}', file=sys.stderr)
        return 1
    finally:
        if raw_root.exists() and not any(raw_root.iterdir()):
            raw_root.rmdir()
    return 0


if __name__ == '__main__':
    sys.exit(main())
