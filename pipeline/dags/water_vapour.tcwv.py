from datetime import datetime
import task_factories
from airflow import DAG
from airflow.models.param import Param
from helper import get_default_layer_version

LAYER_ID = 'water_vapour'
LAYER_VARIABLE = 'tcwv'
RESOLUTION = '2048 1024'
EXTEND = '-180 -90 180 90'
METADATA = {
    "id": f'{LAYER_ID}.{LAYER_VARIABLE}',
    "timestamps": [],  # actual mid-month source dates from staged filenames
    "min_value": 0,
    # Match the source valid_range and legacy ramp, rather than the old 60 cap.
    "max_value": 70,
    "type": "image",
    "zoom_levels": '0-3',
    "units": 'kg/m²',
    "basemap": 'land',
    "legend_values": ['70 kg/m²', '0'],
    "time_format": {
        "year": "numeric",
        "month": "long"
    }
}

BUCKET_ORIGIN = 'esa-cfs-cate-data'
WORKDIR = '/workdir/water_vapour.tcwv'
COLOR_FILE = f'/opt/airflow/plugins/colors/{LAYER_ID}.{LAYER_VARIABLE}.txt'

# Tested v4.2 land 0.05° exports contain unscaled Float32 kg/m², NaN NoData,
# and geographic lat/lon coordinates but no GDAL-readable CRS. Supply the
# verified source CRS explicitly; no scale or unit conversion is required.
WARP_COMMAND = (
    f'gdalwarp -s_srs EPSG:4326 -t_srs EPSG:4326 -te {EXTEND} -ts {RESOLUTION} '
    '-r near --config GDAL_CACHEMAX 256 -wm 128 -co compress=LZW '
    'NETCDF:"$FILEPATH_IN":$DATA_VARIABLE "$FILEPATH_OUT"'
)

default_layer_version = get_default_layer_version()
dag_params = {
    "max_files": Param(2, type=["null", "integer"], minimum=0),
    "output_bucket": Param("esa-cfs-pipeline-output", type="string", enum=['esa-cfs-pipeline-output', 'esa-cfs-tiles']),
    "skip_downloads": Param(False, type="boolean"),
    "layer_version": Param(default_layer_version, type="string")
}

with DAG(dag_id=METADATA["id"], start_date=datetime(2022, 1, 1), schedule=None, catchup=False, params=dag_params, max_active_runs=1) as dag:
    clean_workdir = task_factories.clean_dir_skippable(
        task_id='clean_workdir', dir=WORKDIR)()
    list_files = task_factories.gcs_list_files(
        bucket_name=BUCKET_ORIGIN, layer_id=LAYER_ID, layer_variable=LAYER_VARIABLE)
    download = task_factories.gcs_download_file(
        bucket_name=BUCKET_ORIGIN, dir=WORKDIR, appendix='_downloaded')
    legend_image = task_factories.legend_image(
        workdir=WORKDIR, color_file=COLOR_FILE)
    metadata = task_factories.metadata(workdir=WORKDIR, metadata=METADATA)
    gdal_transforms = task_factories.gdal_transforms(
        layer_variable=LAYER_VARIABLE, color_file=COLOR_FILE,
        layer_type=METADATA['type'], zoom_levels=METADATA['zoom_levels'],
        warp_cmd=WARP_COMMAND, max_tis_warp=1, max_tis_dem=1, max_tis_translate=1)
    upload = task_factories.upload(
        WORKDIR, LAYER_ID, LAYER_VARIABLE, METADATA['type'])

    files = list_files()
    clean_workdir >> files
    downloads = download.expand(filename=files)
    upload_tasks = upload()
    gdal_transforms(downloads) >> upload_tasks
    clean_workdir >> legend_image
    metadata(files) >> upload_tasks
    legend_image >> upload_tasks
