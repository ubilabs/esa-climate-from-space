from datetime import datetime, timedelta
import task_factories
from airflow import DAG
from airflow.models.param import Param

# layer
LAYER_ID = 'cloud'
LAYER_VARIABLE = 'cfc'
LAYER_VERSION = '1.2.3'
METADATA = {
    "id": f'{LAYER_ID}.{LAYER_VARIABLE}',
    "timestamps": [], # will be injected
    "min_value": 0,
    "max_value": 10,
    "type": "tiles",
    "zoom_levels": 7,
    "units": 'mg/m2',
    "basemap": 'blue',
    "legend_values": ["100 %", "0"],
    "time_format": {
        "year": "numeric",
        "month": "long"
    }
}

# dev
NUM_FILES = 10
BUCKET_ORIGIN = 'esa-cfs-cate-data'
BUCKET_TMP = 'esa-cfs-pipeline-tmp'
BUCKET_OUTPUT = 'esa-cfs-pipeline-output'
WORKDIR = '/tmp/files'
COLOR_FILE = f'/opt/airflow/plugins/colors/{LAYER_ID}.{LAYER_VARIABLE}.txt'

dag_params = {
    "max_files": Param(2, type="integer", minimum=0)
}

with DAG(dag_id=METADATA["id"], start_date=datetime(2022, 1, 1), schedule_interval=timedelta(days=1), catchup=False, params=dag_params) as dag:

    # create tasks
    clean_workdir = task_factories.clean_workdir(workdir=WORKDIR)
    list_files = task_factories.gcs_list_files(bucket_name=BUCKET_ORIGIN, layer_id=LAYER_ID, layer_variable=LAYER_VARIABLE)
    download = task_factories.gcs_download_file(bucket_name=BUCKET_ORIGIN, dir=WORKDIR, appendix='_downloaded')
    gdal_info = task_factories.gdal_info()
    legend_image = task_factories.legend_image(bucket_name=BUCKET_OUTPUT, layer_id=LAYER_ID, layer_variable=LAYER_VARIABLE, layer_version=LAYER_VERSION, workdir=WORKDIR, color_file=COLOR_FILE)
    metadata = task_factories.metadata(bucket_name=BUCKET_OUTPUT, layer_id=LAYER_ID, layer_variable=LAYER_VARIABLE, layer_version=LAYER_VERSION, workdir=WORKDIR, metadata=METADATA)
    gdal_transforms = task_factories.gdal_transforms(LAYER_VARIABLE, COLOR_FILE)
    upload = task_factories.gcs_upload_file(bucket_name=BUCKET_OUTPUT, layer_id=LAYER_ID, layer_variable=LAYER_VARIABLE, layer_version=LAYER_VERSION)

    # connect tasks
    files = list_files()
    clean_workdir >> files
    clean_workdir >> legend_image()
    metadata(files)
    downloads = download.expand(filename=files)
    downloads >> gdal_info
    final_images = gdal_transforms(downloads)
    upload.expand(filename=final_images.output)

