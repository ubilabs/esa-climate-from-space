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

def gcs_upload_file(bucket_name=str, layer_id=str, layer_variable=str, layer_version=str):
    @task(task_id='gcs_upload_file')
    def fn(filename: str):
        hook = GCSHook('google')
        remote_filename = f'{layer_id}.{layer_variable}/{layer_version}/{helper.only_filename(filename)}'
        hook.upload(bucket_name, remote_filename, filename)
        return filename
    return fn

def gdal_info():
    return BashOperator(
        task_id='gdal_info',
        bash_command='gdalinfo $FILEPATH_IN',
        env={"FILEPATH_IN": "{{ task_instance.xcom_pull(task_ids='gcs_download_file', key='return_value')[0] }}"}
    )

def legend_image(bucket_name: str, layer_id: str, layer_variable: str, layer_version: str, workdir: str, color_file: str):
    @task_group(group_id='legend_image_group')
    def fn():
        upload_legend = gcs_upload_file(bucket_name=bucket_name, layer_id=layer_id, layer_variable=layer_variable, layer_version=layer_version)
        legend_image = BashOperator(
            task_id='legend_image',
            bash_command=f'rm -f $FILEPATH_OUT && node /opt/airflow/plugins/generate-legend-image.js && echo $FILEPATH_OUT',
            env={"FILEPATH_OUT": f'{workdir}/legend.png', "COLOR_FILE": color_file}
        )
        legend_image >> upload_legend(legend_image.output)
    return fn

# generate timestamps array from filenames and write metadata to json file then upload to gcs
def metadata(bucket_name: str, layer_id: str, layer_variable: str, layer_version: str, workdir: str, metadata: dict):
    @task_group(group_id='metadata_group')
    def fn(files):
        @task()
        def write_metadata_json(files):
            timestamps = str(files)
            extended_metadata = dict({"timestamps": timestamps}, **metadata)
            filepath = str(Path(workdir).joinpath('metadata.json'))

            with open(filepath, "w") as f:
                metadata_string = json.dumps(extended_metadata, indent=4)
                f.write(metadata_string)
                print(metadata_string)

            return filepath

        upload_metadata = gcs_upload_file(bucket_name=bucket_name, layer_id=layer_id, layer_variable=layer_variable, layer_version=layer_version)

        return upload_metadata(write_metadata_json(files))
    return fn

def gdal_transforms(layer_variable: str, color_file: str, gdal_te: str = '-180 -90 180 90', gdal_ts: str = '1024 512'):
    @task_group(group_id='gdal_transforms_group')
    def fn(downloads):
        gdal_warp = BashOperator.partial(
            task_id='gdal_warp',
            bash_command=f'rm -f $FILEPATH_OUT && gdalwarp -t_srs EPSG:4326 -te {gdal_te} -ts {gdal_ts} -r near --config GDAL_CACHEMAX 90% -co compress=LZW NETCDF:"$FILEPATH_IN":$DATA_VARIABLE $FILEPATH_OUT && echo $FILEPATH_OUT'
        )

        gdal_dem = BashOperator.partial(
            task_id='gdal_dem',
            bash_command='rm -f $FILEPATH_OUT && gdaldem color-relief $FILEPATH_IN $COLOR_FILE --config GDAL_CACHEMAX 90% -co compress=LZW -alpha $FILEPATH_OUT && echo $FILEPATH_OUT'
        )

        gdal_translate = BashOperator.partial(
            task_id='gdal_translate',
            bash_command='rm -f $FILEPATH_OUT && gdal_translate -of PNG $FILEPATH_IN $FILEPATH_OUT && echo $FILEPATH_OUT'
        )

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
                "FILEPATH_OUT": helper.change_filename(filename, appendix='', suffix='png'),
            })
        )

        return gdal_translates
    return fn
