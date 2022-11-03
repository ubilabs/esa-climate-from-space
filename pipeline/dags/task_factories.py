import json
import helper
from pathlib import Path
from airflow.operators.bash import BashOperator
from airflow.decorators import task, task_group
from airflow.providers.google.cloud.hooks.gcs import GCSHook

def clean_workdir(workdir: str):
    return BashOperator(
        task_id='clean_workdir',
        bash_command=f'rm -rf {workdir} && mkdir -p {workdir}'
    )

def gcs_list_files(bucket_name: str, layer_id: str, layer_variable: str):
    @task(task_id='gcs_list_files')
    def fn(**context):
        max_files=context["params"]["max_files"]
        hook = GCSHook('google')
        filenames = hook.list(bucket_name, prefix=f'{layer_id}.{layer_variable}', delimiter='.nc')
        filenames = [f for f in filenames if f.endswith('.nc')]
        if (max_files > 0): filenames = filenames[:max_files]
        filenames.sort()
        return filenames
    return fn

def gcs_download_file(bucket_name: str, dir: str, appendix: str = ''):
    @task(task_id='gcs_download_file')
    def fn(filename: str):
        hook = GCSHook('google')
        local_filename = dir + '/' + helper.only_filename(helper.change_filename(filename, appendix))
        hook.download(bucket_name, filename, local_filename)
        return local_filename
    return fn

def gcs_upload_file(bucket_name: str, layer_id: str, layer_variable: str, layer_version: str):
    @task(task_id='gcs_upload_file')
    def fn(filename: str):
        hook = GCSHook('google')
        remote_filename = f'{layer_id}.{layer_variable}/{layer_version}/{helper.only_filename(filename)}'
        hook.upload(bucket_name, remote_filename, filename)
        return filename
    return fn

def gcloud_upload_dir(bucket_name: str, layer_id: str, layer_variable: str, layer_version: str, directory: str):
    return BashOperator(
        task_id='gcloud_upload',
        bash_command='gcloud auth activate-service-account --key-file $KEY_FILE && gsutil -m cp -r $UPLOAD_DIR/* $BUCKET',
        env={
            "UPLOAD_DIR": directory,
            "BUCKET": f'gs://{bucket_name}/{layer_id}.{layer_variable}/{layer_version}/final/',
            "KEY_FILE": '/opt/airflow/plugins/service-account.json',
            "CLOUDSDK_PYTHON": '/usr/local/bin/python'
        }
    )

def gdal_info():
    return BashOperator(
        task_id='gdal_info',
        bash_command='gdalinfo $FILEPATH_IN',
        env={"FILEPATH_IN": "{{ task_instance.xcom_pull(task_ids='gcs_download_file', key='return_value')[0] }}"}
    )

def legend_image(bucket_name: str, layer_id: str, layer_variable: str, layer_version: str, workdir: str, color_file: str):
    return BashOperator(
        task_id='legend_image',
        bash_command=f'rm -f $FILEPATH_OUT && node /opt/airflow/plugins/generate-legend-image.js && echo $FILEPATH_OUT',
        env={"FILEPATH_OUT": f'{workdir}/legend.png', "COLOR_FILE": color_file}
    )

# generate timestamps array from filenames and write metadata to json file then upload to gcs
def metadata(bucket_name: str, layer_id: str, layer_variable: str, layer_version: str, workdir: str, metadata: dict):
    @task(task_id='metadata')
    def fn(files):
        timestamps = list(map(helper.filename_to_date, files))
        extended_metadata = dict(metadata, **{"timestamps": timestamps})
        filepath = str(Path(workdir).joinpath('metadata.json'))

        with open(filepath, "w") as f:
            metadata_string = json.dumps(extended_metadata, indent=4)
            f.write(metadata_string)
            print(metadata_string)

        return filepath
    return fn

def gdal_transforms(layer_variable: str, color_file: str, layer_type: str, zoom_levels: str, gdal_te: str = '-180 -90 180 90', gdal_ts: str = '1024 512', warp_cmd: str = None, max_tis_warp: int = 4,  max_tis_dem: int = 4, max_tis_translate: int = 4):
    def get_transform_task():
        if layer_type == 'image':
            return BashOperator.partial(
                task_id='gdal_translate_image',
                bash_command='rm -f $FILEPATH_OUT && gdal_translate -of PNG $FILEPATH_IN $FILEPATH_OUT && echo $FILEPATH_OUT',
                max_active_tis_per_dag=max_tis_translate
            )

        return BashOperator.partial(
            task_id='gdal_translate_tiles',
            bash_command=f'rm -rf $FILEPATH_OUT && gdal2tiles.py --profile geodetic --zoom={zoom_levels} --tmscompatible --no-kml --webviewer=none --resampling average --s_srs EPSG:4326 $FILEPATH_IN $FILEPATH_OUT && echo $FILEPATH_OUT' ,
            max_active_tis_per_dag=max_tis_translate
        )

    def get_transform_outpath(filename):
        if layer_type == 'image':
            return helper.change_filename(filename, appendix='', suffix='png')

        return helper.change_filename(filename, appendix='', remove_suffix=True)

    @task_group(group_id='gdal_transforms_group')
    def fn(downloads):
        warp_command = f'gdalwarp -t_srs EPSG:4326 -te {gdal_te} -ts {gdal_ts} -r near --config GDAL_CACHEMAX 90% -co compress=LZW NETCDF:"$FILEPATH_IN":$DATA_VARIABLE $FILEPATH_OUT' if not warp_cmd else warp_cmd
        gdal_warp = BashOperator.partial(
            task_id='gdal_warp',
            bash_command=f'rm -f $FILEPATH_OUT && {warp_command} && echo $FILEPATH_OUT',
            max_active_tis_per_dag=max_tis_warp
        )

        gdal_dem = BashOperator.partial(
            task_id='gdal_dem',
            bash_command='rm -f $FILEPATH_OUT && gdaldem color-relief $FILEPATH_IN $COLOR_FILE --config GDAL_CACHEMAX 90% -co compress=LZW -alpha $FILEPATH_OUT && echo $FILEPATH_OUT',
            max_active_tis_per_dag=max_tis_dem
        )

        gdal_translate = get_transform_task()

        gdal_warps = gdal_warp.expand(
            env=downloads.map(lambda filename: {
                "FILEPATH_IN": filename,
                "FILEPATH_OUT": helper.change_filename(filename, appendix='warped', suffix='tiff'),
                "DATA_VARIABLE": layer_variable
            })
        )

        gdal_dems = gdal_dem.expand(
            env=gdal_warps.output.map(lambda filename: {
                "FILEPATH_IN": filename,
                "FILEPATH_OUT": helper.change_filename(filename, appendix='colored'),
                "COLOR_FILE": color_file
            })
        )

        gdal_translates = gdal_translate.expand(
            env=gdal_dems.output.map(lambda filename: {
                "FILEPATH_IN": filename,
                "FILEPATH_OUT": get_transform_outpath(filename)
            })
        )

        return gdal_translates
    return fn
