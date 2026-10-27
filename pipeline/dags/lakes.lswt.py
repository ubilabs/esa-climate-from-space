from datetime import datetime
import task_factories
from airflow import DAG
from airflow.models.param import Param
from helper import get_default_layer_version

LAYER_ID = 'lakes'
LAYER_VARIABLE = 'lswt'
RESOLUTION = '4320 2160'
EXTEND = '-180 -90 180 90'
METADATA = {
    "id": f'{LAYER_ID}.{LAYER_VARIABLE}',
    "timestamps": [],  # actual monthly snapshot dates from staged filenames
    # Display metadata is physical Celsius; the rendering ramp uses packed values.
    "min_value": -5,
    "max_value": 35,
    "type": "image",
    "zoom_levels": '0-3',
    "units": '°C',
    "basemap": 'dark',
    "legend_values": ['35 °C', '-5'],
    "time_format": {
        "year": "numeric",
        "month": "long"
    }
}

BUCKET_ORIGIN = 'esa-cfs-cate-data'
WORKDIR = '/workdir/lakes.lswt'
COLOR_FILE = f'/opt/airflow/plugins/colors/{LAYER_ID}.{LAYER_VARIABLE}.txt'

# Staged Lakes v3.0.0 has Int16 LSWT with K = raw * 0.01 + 273.15.
# GDAL warp preserves the packed samples, so the ramp is in hundredths of °C.
# Do not unscale to Kelvin before applying this ramp. Native NoData=-32768 is
# handled by the ramp's nv entry, not by the old pipeline's -42767 sentinel.
# Bound the cache: each sparse source still spans 43200 x 21600 cells.
WARP_COMMAND = (
    f'gdalwarp -t_srs EPSG:4326 -te {EXTEND} -ts {RESOLUTION} '
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
