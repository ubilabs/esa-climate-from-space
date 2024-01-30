from datetime import datetime
import glob
import task_factories
import helper
from airflow import DAG
from airflow.models.param import Param
from airflow.operators.bash import BashOperator
from airflow.operators.empty import EmptyOperator
from airflow.decorators import task

# layer
LAYER_ID = 'sea_ice'
LAYER_VARIABLE = 'ice_conc'
LAYER_VERSION = '1.2.3'
RESOLUTION = '2444 496'
METADATA = {
    "id": f'{LAYER_ID}.{LAYER_VARIABLE}',
    "version": LAYER_VERSION,
    "timestamps": [],  # will be injected
    "min_value": 0,
    "max_value": 100,
    "type": "tiles",  # 'tiles' or 'image'
    "zoom_levels": '0-3',
    "units": 'm',
    "basemap": 'blue',
    "legend_values": ["100 %", "0"],
    "time_format": {
        "year": "numeric",
        "month": "long"
    }
}

# dev
BUCKET_ORIGIN = 'esa-cfs-cate-data'
BUCKET_TMP = 'esa-cfs-pipeline-tmp'
WORKDIR = '/workdir/files'
COLOR_FILE = f'/opt/airflow/plugins/colors/{LAYER_ID}.{LAYER_VARIABLE}.txt'
DEBUG = False

dag_params = {
    "max_files": Param(2, type=["null", "integer"], minimum=0,),
    "output_bucket": Param("esa-cfs-pipeline-output", type=["string"])
}


with DAG(dag_id=METADATA["id"], start_date=datetime(2022, 1, 1), schedule=None, catchup=False, params=dag_params) as dag:

    dry_run = False

    # create tasks
    clean_workdir = task_factories.clean_dir(
        task_id='clean_workdir', dir=WORKDIR, dry_run=dry_run)

    list_files_nh = task_factories.gcs_list_files(
        bucket_name=BUCKET_ORIGIN, layer_id=LAYER_ID + '_nh', layer_variable=LAYER_VARIABLE, task_id='list_files_nh')
    download_nh = task_factories.gcs_download_file(
        bucket_name=BUCKET_ORIGIN, dir=WORKDIR, appendix='_nh_downloaded', task_id='download_file_nh', dry_run=dry_run)

    list_files_sh = task_factories.gcs_list_files(
        bucket_name=BUCKET_ORIGIN, layer_id=LAYER_ID + '_sh', layer_variable=LAYER_VARIABLE, task_id='list_files_sh')
    download_sh = task_factories.gcs_download_file(
        bucket_name=BUCKET_ORIGIN, dir=WORKDIR, appendix='_sh_downloaded', task_id='download_file_sh', dry_run=dry_run)

    legend_image = task_factories.legend_image(
        workdir=WORKDIR, color_file=COLOR_FILE)
    metadata = task_factories.metadata(workdir=WORKDIR, metadata=METADATA)

    gdal_te_nh = "-180 16.62393 180 90"
    gdal_te_sh = "-180 -90 180 -16.62393"
    warp_command_nh = f'gdalwarp -t_srs EPSG:4326 -te {gdal_te_nh} -ts {RESOLUTION} -r near --config GDAL_CACHEMAX 90% -co compress=LZW NETCDF:"$FILEPATH_IN":$DATA_VARIABLE $FILEPATH_OUT'
    warp_command_sh = f'gdalwarp -t_srs EPSG:4326 -te {gdal_te_sh} -ts {RESOLUTION} -r near --config GDAL_CACHEMAX 90% -co compress=LZW NETCDF:"$FILEPATH_IN":$DATA_VARIABLE $FILEPATH_OUT'

    gdal_warp_nh = BashOperator.partial(
        task_id='reproject_and_to_tiff_nh',
        bash_command=f'rm -f $FILEPATH_OUT && {warp_command_nh} && echo $FILEPATH_OUT',
    )
    gdal_warp_sh = BashOperator.partial(
        task_id='reproject_and_to_tiff_sh',
        bash_command=f'rm -f $FILEPATH_OUT && {warp_command_sh} && echo $FILEPATH_OUT',
    )

    gdal_merge = BashOperator.partial(
        task_id='merge_tiffs',
        bash_command=f'rm -f $FILEPATH_OUT && gdal_merge.py -o $FILEPATH_OUT $FILEPATH_IN_NH $FILEPATH_IN_SH && echo $FILEPATH_OUT'
    )

    upload = task_factories.upload(
        WORKDIR, LAYER_ID, LAYER_VARIABLE, LAYER_VERSION, METADATA['type'])

    gdal_dem = BashOperator.partial(
        task_id='gdal_dem',
        bash_command='rm -f $FILEPATH_OUT && gdaldem color-relief $FILEPATH_IN $COLOR_FILE --config GDAL_CACHEMAX 90% -co compress=LZW -alpha $FILEPATH_OUT && echo $FILEPATH_OUT'
    )

    gdal_translate = BashOperator.partial(
        task_id='gdal_translate_tiles',
        bash_command=f'rm -rf $FILEPATH_OUT && gdal2tiles.py --profile geodetic --zoom={METADATA["zoom_levels"]} --tmscompatible --no-kml --webviewer=none --resampling average --s_srs EPSG:4326 $FILEPATH_IN $FILEPATH_OUT && echo $FILEPATH_OUT'
    )

    wait_for_nh = EmptyOperator(task_id='wait_for_nh')
    wait_for_sh = EmptyOperator(task_id='wait_for_sh')

    @task()
    def list_warped_files():
        return glob.glob(f'{WORKDIR}/*_nh_warped.tiff')

    warped_files = list_warped_files()

    # connect tasks
    files_nh = list_files_nh()
    files_sh = list_files_sh()

    clean_workdir >> files_nh
    clean_workdir >> files_sh

    downloads_nh = download_nh.expand(filename=files_nh)
    downloads_sh = download_sh.expand(filename=files_sh)

    gdal_warps_nh = gdal_warp_nh.expand(
        env=downloads_nh.map(lambda filename: {
            "FILEPATH_IN": filename,
            "FILEPATH_OUT": helper.change_filename(filename, appendix='_nh_warped', suffix='tiff'),
            "DATA_VARIABLE": LAYER_VARIABLE
        })
    )

    gdal_warps_sh = gdal_warp_sh.expand(
        env=downloads_sh.map(lambda filename: {
            "FILEPATH_IN": filename,
            "FILEPATH_OUT": helper.change_filename(filename, appendix='_sh_warped', suffix='tiff'),
            "DATA_VARIABLE": LAYER_VARIABLE
        })
    )

    gdal_warps_nh >> wait_for_nh >> warped_files
    gdal_warps_sh >> wait_for_sh >> warped_files

    gdal_merges = gdal_merge.expand(
        env=warped_files.map(lambda filename: {
            "FILEPATH_OUT": helper.change_filename(filename, appendix='_merged', suffix='tiff'),
            "FILEPATH_IN_NH": helper.change_filename(filename, appendix='_nh_warped', suffix='tiff'),
            "FILEPATH_IN_SH": helper.change_filename(filename, appendix='_sh_warped', suffix='tiff')
        })
    )

    gdal_dems = gdal_dem.expand(
        env=gdal_merges.output.map(lambda filename: {
            "FILEPATH_IN": filename,
            "FILEPATH_OUT": helper.change_filename(filename, appendix='colored'),
            "COLOR_FILE": COLOR_FILE
        })
    )

    gdal_translates = gdal_translate.expand(
        env=gdal_dems.output.map(lambda filename: {
            "FILEPATH_IN": filename,
            "FILEPATH_OUT": helper.change_filename(filename, appendix='', remove_suffix=True)
        })
    )

    gdal_translates >> upload()

    clean_workdir >> legend_image
    metadata(files_nh)  # only needs one set of images
