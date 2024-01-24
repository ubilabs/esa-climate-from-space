from datetime import datetime
import task_factories
from airflow import DAG
from airflow.models.param import Param

# layer
LAYER_ID = 'cloud'
LAYER_VARIABLE = 'cfc'
LAYER_VERSION = '1.2.3'
RESOLUTION = '1024 512'
METADATA = {
    "id": f'{LAYER_ID}.{LAYER_VARIABLE}',
    "version": LAYER_VERSION,
    "timestamps": [], # will be injected
    "min_value": 0,
    "max_value": 1,
    "type": "image", # 'tiles' or 'image'
    "zoom_levels": '0-2',
    "units": 'mg/m2',
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
BUCKET_OUTPUT = 'esa-cfs-pipeline-output'
WORKDIR = '/workdir/files'
COLOR_FILE = f'/opt/airflow/plugins/colors/{LAYER_ID}.{LAYER_VARIABLE}.txt'
DEBUG=False

dag_params = {
    "max_files": Param(2, type="integer", minimum=0)
}

with DAG(dag_id=METADATA["id"], start_date=datetime(2022, 1, 1), schedule=None, catchup=False, params=dag_params) as dag:

    # create tasks
    clean_workdir = task_factories.clean_dir(task_id='clean_workdir', dir=WORKDIR)
    list_files = task_factories.gcs_list_files(bucket_name=BUCKET_ORIGIN, layer_id=LAYER_ID, layer_variable=LAYER_VARIABLE)
    download = task_factories.gcs_download_file(bucket_name=BUCKET_ORIGIN, dir=WORKDIR, appendix='_downloaded', dry_run=False)
    legend_image = task_factories.legend_image(workdir=WORKDIR, color_file=COLOR_FILE)
    metadata = task_factories.metadata(workdir=WORKDIR, metadata=METADATA)
    gdal_transforms = task_factories.gdal_transforms(layer_variable=LAYER_VARIABLE, color_file=COLOR_FILE, layer_type=METADATA['type'], zoom_levels=METADATA['zoom_levels'], gdal_ts=RESOLUTION)
    upload = task_factories.upload(BUCKET_OUTPUT, WORKDIR, LAYER_ID, LAYER_VARIABLE, LAYER_VERSION, METADATA['type'])

    # connect tasks
    files = list_files()
    clean_workdir >> files
    downloads = download.expand(filename=files)
    gdal_transforms(downloads) >> upload()
    clean_workdir >> legend_image
    metadata(files)

    if DEBUG:
        downloads >> task_factories.gdal_info()


