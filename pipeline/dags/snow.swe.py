from datetime import datetime
import task_factories
from airflow import DAG
from airflow.models.param import Param
from helper import get_default_layer_version

# Match data/triggers/snow_swe.sh and the legacy SWE color ramp.
LAYER_ID = 'snow'
LAYER_VARIABLE = 'swe'
RESOLUTION = '1440 720'
EXTEND = '-180 -90 180 90'
METADATA = {
    "id": f'{LAYER_ID}.{LAYER_VARIABLE}',
    "timestamps": [],  # will be injected from the staged snapshot filenames
    "min_value": 0,
    "max_value": 250,
    "type": "image",
    "zoom_levels": '0-3',
    "units": 'mm',
    "basemap": 'blue',
    "time_format": {
        "year": "numeric",
        "month": "long"
    }
}

BUCKET_ORIGIN = 'esa-cfs-cate-data'
WORKDIR = '/workdir/snow.swe'
COLOR_FILE = f'/opt/airflow/plugins/colors/{LAYER_ID}.{LAYER_VARIABLE}.txt'

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
    # Staged v4.0 files have WGS84 lat/lon coordinates and native NoData=-100000.
    # Nearest-neighbour resampling retains the negative categorical flags;
    # color relief clamps them to the transparent zero end of the legacy ramp.
    gdal_transforms = task_factories.gdal_transforms(
        layer_variable=LAYER_VARIABLE, color_file=COLOR_FILE,
        layer_type=METADATA['type'], zoom_levels=METADATA['zoom_levels'],
        gdal_ts=RESOLUTION, gdal_te=EXTEND)
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
