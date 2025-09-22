from datetime import datetime
import task_factories
from airflow import DAG
from airflow.models.param import Param
from helper import get_default_layer_version

# layer
LAYER_ID = 'soil_moisture'
LAYER_VARIABLE = 'Anomaly'
LAYER_VERSION = '1.14.1'
RESOLUTION = '1440 720'
EXTEND = '-180 -90 180 90'
METADATA = {
    "id": f'{LAYER_ID}.{LAYER_VARIABLE}',
    "version": LAYER_VERSION,
    "timestamps": [],  # will be injected
    "min_value": -0.1,
    "max_value": 0.1,
    "type": "image",  # 'tiles' or 'image'
    "zoom_levels": '0-3',
    "units": 'm3 m-3',
    "basemap": None,
    "legend_values": ["100 l/m³", "0", "-100"],
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

default_layer_version = get_default_layer_version()
dag_params = {
    "max_files": Param(2, type=["null", "integer"], minimum=0,),
    "output_bucket": Param("esa-cfs-pipeline-output", type=["string"]),
    "skip_downloads": Param(False, type="boolean"),
    "layer_version": Param(default_layer_version, type="string")
}

with DAG(dag_id=METADATA["id"], start_date=datetime(2022, 1, 1), schedule=None, catchup=False, params=dag_params) as dag:

    # create tasks
    clean_workdir = task_factories.clean_dir(
        task_id='clean_workdir', dir=WORKDIR)
    list_files = task_factories.gcs_list_files(
        bucket_name=BUCKET_ORIGIN, layer_id=LAYER_ID, layer_variable=LAYER_VARIABLE)
    download = task_factories.gcs_download_file(
        bucket_name=BUCKET_ORIGIN, dir=WORKDIR, appendix='_downloaded')
    legend_image = task_factories.legend_image(
        workdir=WORKDIR, color_file=COLOR_FILE)
    metadata = task_factories.metadata(workdir=WORKDIR, metadata=METADATA)
    gdal_transforms = task_factories.gdal_transforms(
        layer_variable=LAYER_VARIABLE, color_file=COLOR_FILE, layer_type=METADATA['type'], zoom_levels=METADATA['zoom_levels'], gdal_ts=RESOLUTION, gdal_te=EXTEND)
    upload = task_factories.upload(
        WORKDIR, LAYER_ID, LAYER_VARIABLE, METADATA['type'])

    # connect tasks
    files = list_files()
    clean_workdir >> files
    downloads = download.expand(filename=files)
    gdal_transforms(downloads) >> upload()
    clean_workdir >> legend_image
    metadata(files)

    if DEBUG:
        downloads >> task_factories.gdal_info()
