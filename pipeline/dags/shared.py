from pathlib import Path
from datetime import datetime, timedelta
from airflow.providers.google.cloud.hooks.gcs import GCSHook


def only_filename(filepath: str):
    return Path(filepath).name

def change_filename(filepath: str, appendix: str = '', suffix: str = ''):
    if appendix and not appendix.startswith('_'): appendix = '_' + appendix
    if suffix and not suffix.startswith('.'): suffix = '.' + suffix

    p = Path(filepath)
    name = p.name.replace(p.suffix, '').split('_')[0]
    new_suffix = suffix or p.suffix 
    return p.with_name(name + appendix + new_suffix)


def gcs_download_file(bucket_name: str, dir: str, appendix: str = ''):
    def fn(filename: str):
        hook = GCSHook('google')
        local_filename = dir + '/' + only_filename(change_filename(filename, appendix))
        hook.download(bucket_name, filename, local_filename)
        return local_filename
    return fn

def gcs_upload_file(bucket_name: str, layer_id: str, layer_variable: str, layer_version: str):
    def fn(local_filename: str):
        hook = GCSHook('google')
        remote_filename = f'{layer_id}.{layer_variable}/{layer_version}/{only_filename(local_filename)}'
        hook.upload(bucket_name, remote_filename, local_filename)
        return local_filename
    return fn

def gcs_list(bucket_name: str, layer_id: str, layer_variable: str, max_files: int = 0):
    def list_files():
        hook = GCSHook('google')
        filenames = hook.list(bucket_name, prefix=f'{layer_id}.{layer_variable}', delimiter='.nc')
        filenames = [f for f in filenames if f.endswith('.nc')]
        if (max_files > 0): filenames = filenames[:max_files]
        filenames.sort()
        return filenames
    return list_files

def filename_to_date(filename: str):
    date_string = filename.split('/')[-1].replace('.nc', '')
    return datetime.strptime(date_string, "%Y%m%d").isoformat() + 'Z'