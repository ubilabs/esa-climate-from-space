from pathlib import Path
from datetime import datetime
import tempfile
import requests

def only_filename(filepath: str):
    return Path(filepath).name

def change_filename(filepath: str, appendix: str = '', suffix: str = '', remove_suffix = False):
    if appendix and not appendix.startswith('_'): appendix = '_' + appendix
    if suffix and not suffix.startswith('.'): suffix = '.' + suffix

    p = Path(filepath)
    name = p.name.replace(p.suffix, '').split('_')[0]
    new_suffix = suffix or p.suffix if not remove_suffix else ''

    return str(p.with_name(name + appendix + new_suffix))

def filename_to_date(filename: str):
    date_string = filename.split('/')[-1].replace('.nc', '')
    return datetime.strptime(date_string, "%Y%m%d").isoformat() + 'Z'

def date_to_filename(date_string: str):
    return datetime.fromisoformat(date_string.replace('Z', '')).strftime('%Y%m%d')

# fetch the latest version number from develop branch on github
# This runs every time a DAG file is parsed, including at the start of each task. A short network
# outage must not make the DAG fail to import (which kills all running tasks), so the last fetched
# version is cached and used as a fallback. Runs take the actual version from their own conf.
LAYER_VERSION_CACHE = Path(tempfile.gettempdir()) / 'esa-cfs-default-layer-version'

def get_default_layer_version():
    try:
        req = requests.get('https://raw.githubusercontent.com/ubilabs/esa-climate-from-space/develop/package.json', timeout=10)
        req.raise_for_status()
        version = req.json()['version']
        LAYER_VERSION_CACHE.write_text(version)
        return version
    except Exception as error:
        if LAYER_VERSION_CACHE.exists():
            return LAYER_VERSION_CACHE.read_text().strip()
        print(f'Could not fetch the default layer version: {error}')
        return ''


