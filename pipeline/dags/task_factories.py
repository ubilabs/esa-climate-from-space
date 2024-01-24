import os
import json
import helper
from pathlib import Path
import shutil
from airflow.operators.empty import EmptyOperator
from airflow.operators.bash import BashOperator
from airflow.decorators import task, task_group
from airflow.providers.google.cloud.hooks.gcs import GCSHook


def clean_dir(task_id: str, dir: str, dry_run=False):
    if dry_run:
        return EmptyOperator(task_id=task_id + '_dry_run')
    return BashOperator(
        task_id=task_id,
        bash_command=f'rm -rf {dir}/* && mkdir -p {dir}'
    )


def gcs_list_files(bucket_name: str, layer_id: str, layer_variable: str, task_id: str = 'gcs_list_files'):
    @task(task_id=task_id)
    def fn(**context):
        max_files = context["params"]["max_files"]
        hook = GCSHook('google')
        filenames = hook.list(
            bucket_name, match_glob=f'{layer_id}.{layer_variable}/*.nc')

        filenames = [f for f in filenames if f.endswith('.nc')]
        filenames.sort()

        if (max_files is not None and max_files > 0):
            filenames = filenames[:max_files]

        return filenames
    return fn


def gcs_download_file(bucket_name: str, dir: str, appendix: str = '', dry_run=False, task_id="gcs_download_file"):
    @task(task_id=task_id if not dry_run else 'gcs_download_file_dry_run')
    def fn(filename: str):
        hook = GCSHook('google')
        local_filename = dir + '/' + \
            helper.only_filename(helper.change_filename(filename, appendix))
        if not dry_run:
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
        bash_command='gcloud auth activate-service-account --key-file $KEY_FILE && gsutil -q -m cp -r $UPLOAD_DIR/* $BUCKET',
        env={
            "UPLOAD_DIR": directory,
            "BUCKET": f'gs://{bucket_name}/{layer_version}/{layer_id}.{layer_variable}/',
            "KEY_FILE": '/opt/airflow/plugins/service-account.json',
            "CLOUDSDK_PYTHON": '/usr/local/bin/python'
        }
    )


def gdal_info():
    return BashOperator(
        task_id='gdal_info',
        bash_command='gdalinfo $FILEPATH_IN',
        env={
            "FILEPATH_IN": "{{ task_instance.xcom_pull(task_ids='gcs_download_file', key='return_value')[0] }}"}
    )


def legend_image(workdir: str, color_file: str):
    return BashOperator(
        task_id='legend_image',
        bash_command=f'rm -f $FILEPATH_OUT && node /opt/airflow/plugins/generate-legend-image.js && echo $FILEPATH_OUT',
        env={"FILEPATH_OUT": f'{workdir}/legend.png', "COLOR_FILE": color_file}
    )

# generate timestamps array from filenames and write metadata to json file then upload to gcs


def metadata(workdir: str, metadata: dict):
    @task(task_id='metadata')
    def fn(files):
        timestamps = list(map(helper.filename_to_date, files))
        extended_metadata = dict(metadata, **{"timestamps": timestamps})
        formatted_metadata = {
            "id": extended_metadata["id"],
            "version": extended_metadata["version"],
            "timestamps": extended_metadata['timestamps'],
            "minValue": extended_metadata['min_value'],
            "maxValue": extended_metadata['max_value'],
            "type": extended_metadata['type'],
            "zoomLevels": extended_metadata['zoom_levels'],
            "units": extended_metadata['units'],
            "legendValues": extended_metadata['legend_values'],
            "timeFormat": extended_metadata['time_format'],
            "basemap": extended_metadata['basemap']
        }
        filepath = str(Path(workdir).joinpath('metadata.json'))

        with open(filepath, "w") as f:
            metadata_string = json.dumps(formatted_metadata, indent=4)
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
            bash_command=f'rm -rf $FILEPATH_OUT && gdal2tiles.py --profile geodetic --zoom={zoom_levels} --tmscompatible --no-kml --webviewer=none --resampling average --s_srs EPSG:4326 $FILEPATH_IN $FILEPATH_OUT && echo $FILEPATH_OUT',
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
            task_id='reproject_and_to_tiff',
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


def upload(bucket_name: str, workdir: str, layer_id: str, layer_variable: str, layer_version: str, layer_type: str):
    @task_group(group_id='upload')
    def fn():
        upload_dir = f'{workdir}/upload'
        clean_upload_dir = clean_dir(
            task_id='clean_upload_dir', dir=upload_dir)
        prepare_upload_task = prepare_upload(workdir, upload_dir, layer_type)
        upload_task = gcloud_upload_dir(
            bucket_name, layer_id, layer_variable, layer_version, directory=upload_dir)
        clean_upload_dir >> prepare_upload_task() >> upload_task
    return fn


def prepare_upload(workdir: str, upload_dir: str, layer_type: str):
    @task(task_id='prepare_upload')
    def fn():
        metadata_filepath = str(Path(workdir).joinpath('metadata.json'))

        # copy full size images or tile folders
        with open(metadata_filepath, "r") as f:
            metadata = json.loads(f.read())

            for i, timestamp in enumerate(metadata['timestamps']):
                output_name = helper.date_to_filename(timestamp)

                if layer_type == 'image':
                    src = f'{workdir}/{output_name}.png'
                    dst = f'{upload_dir}/tiles/{i}/full.png'
                    os.makedirs(os.path.dirname(dst), exist_ok=True)
                    shutil.copyfile(src, dst)

                else:
                    print('no')
                    src = f'{workdir}/{output_name}'
                    dst = f'{upload_dir}/tiles/{i}'
                    shutil.copytree(
                        src, dst, ignore=shutil.ignore_patterns('*.kml'))

            print(os.listdir(upload_dir))

        # copy metadata file
        shutil.copyfile(metadata_filepath, f'{upload_dir}/metadata.json')
        # copy legend image
        shutil.copyfile(f'{workdir}/legend.png', f'{upload_dir}/legend.png')
        # make zip archive for offline usage
        zip_file = f'{workdir}/package'
        shutil.make_archive(zip_file, 'zip', root_dir=upload_dir)
        shutil.copyfile(f'{zip_file}.zip', f'{upload_dir}/package.zip')

    return fn


# def clamp_netcdf(layer_variable: str, min_value: float, max_value: float):
#     @task(task_id='clamp_netcdf')
#     def fn(filename):
#         import xarray as xr
#         print(filename)
#         ds = xr.open_dataset(filename)
#         ds[layer_variable] = ds[layer_variable].clip(min_value, max_value)
#         new_filename = helper.change_filename(filename, appendix='clamped')
#         encoding = {var: {"zlib": True, "complevel": 9} for var in ds.data_vars}
#         ds.to_netcdf(new_filename, engine='netcdf4', encoding=encoding)
#         ds.close()
#         return new_filename

#     return fn
