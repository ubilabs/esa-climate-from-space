from datetime import datetime
import task_factories
from airflow import DAG
from airflow.models.param import Param
from helper import get_default_layer_version

# layer
LAYER_ID = 'oc'
LAYER_VARIABLE = 'chlor_a'
RESOLUTION = '2048 1024'
EXTEND = '-180 -90 180 90'
METADATA = {
    "id": f'{LAYER_ID}.{LAYER_VARIABLE}',
    "timestamps": [],  # will be injected
    "min_value": 0,
    "max_value": 0,
    "type": "image",  # 'tiles' or 'image'
    "zoom_levels": '0-2',
    "units": 'mg/m³',
    "basemap": 'ocean',
    "legend_values": ["30 mg/m\u00b3", "3", "0.3", "0.03"],
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
    "output_bucket": Param("esa-cfs-pipeline-output", type=["string"], enum=['esa-cfs-pipeline-output', 'esa-cfs-tiles']),
    "skip_downloads": Param(False, type="boolean"),
    "layer_version": Param(default_layer_version, type="string")
}

with DAG(dag_id=METADATA["id"], start_date=datetime(2022, 1, 1), schedule=None, catchup=False, params=dag_params) as dag:

    # create tasks
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
