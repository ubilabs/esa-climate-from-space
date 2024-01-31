from pathlib import Path
from datetime import datetime
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
def get_default_layer_version():
    req = requests.get('https://raw.githubusercontent.com/ubilabs/esa-climate-from-space/develop/package.json')
    package_json = (req.json())
    return package_json['version']


