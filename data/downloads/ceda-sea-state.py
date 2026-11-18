"""Download Sea State CCI v4.0 monthly L4 SWH files from CEDA over HTTPS.

The ESA CCI Toolbox cannot open this dataset (CEDA blocks OPeNDAP for v4.0),
so the original monthly files are fetched directly. One file per month,
saved as YYYYMMDD.nc. Existing files are skipped, so reruns resume.
"""

from argparse import ArgumentParser
from datetime import date
from pathlib import Path
import shutil
import sys
import urllib.error
import urllib.request

BASE_URL = 'https://dap.ceda.ac.uk/neodc/esacci/sea_state/data/v4_release/altimeter/l4/v4.0'
FIRST, LAST = date(1992, 1, 1), date(2023, 12, 1)
DOWNLOAD_ROOT = Path(__file__).resolve().parents[2] / 'download'


def months(start, end):
    current = date(start.year, start.month, 1)
    while current <= end:
        yield current
        current = date(current.year + current.month // 12, current.month % 12 + 1, 1)


def main():
    parser = ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument('--start-date', type=date.fromisoformat, default=FIRST)
    parser.add_argument('--end-date', type=date.fromisoformat, default=LAST)
    parser.add_argument('--output-dir', type=Path, default=DOWNLOAD_ROOT / 'sea-state' / 'v4.0')
    parser.add_argument('--max-files', type=int)
    args = parser.parse_args()

    args.output_dir.mkdir(parents=True, exist_ok=True)
    selected = list(months(max(args.start_date, FIRST), min(args.end_date, LAST)))[:args.max_files]
    print(f'{len(selected)} file(s) -> {args.output_dir}', flush=True)

    for month in selected:
        output = args.output_dir / f'{month:%Y%m%d}.nc'
        if output.exists():
            print(f'SKIP {output.name}', flush=True)
            continue
        url = f'{BASE_URL}/{month:%Y}/ESACCI-SEASTATE-L4-SWH-MULTI_1M-{month:%Y%m}-fv01.nc'
        partial = output.with_suffix('.nc.part')
        try:
            with urllib.request.urlopen(url, timeout=120) as response, open(partial, 'wb') as file:
                shutil.copyfileobj(response, file)
        except (urllib.error.URLError, OSError) as error:
            partial.unlink(missing_ok=True)
            print(f'Download failed for {url}: {error}', file=sys.stderr)
            return 1
        partial.rename(output)
        print(f'DOWNLOAD {output.name}', flush=True)
    return 0


if __name__ == '__main__':
    sys.exit(main())
