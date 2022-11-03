from pathlib import Path
from datetime import datetime

def only_filename(filepath: str):
    return Path(filepath).name

def change_filename(filepath: str, appendix: str = '', suffix: str = ''):
    if appendix and not appendix.startswith('_'): appendix = '_' + appendix
    if suffix and not suffix.startswith('.'): suffix = '.' + suffix

    p = Path(filepath)
    name = p.name.replace(p.suffix, '').split('_')[0]
    new_suffix = suffix or p.suffix 
    return p.with_name(name + appendix + new_suffix)

def filename_to_date(filename: str):
    date_string = filename.split('/')[-1].replace('.nc', '')
    return datetime.strptime(date_string, "%Y%m%d").isoformat() + 'Z'


