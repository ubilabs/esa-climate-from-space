from datetime import datetime
import task_factories
from airflow import DAG
from airflow.models.param import Param
from helper import get_default_layer_version

# layer
LAYER_ID = 'land_cover'
LAYER_VARIABLE = 'class'
RESOLUTION = '1440000 720000'
METADATA = {
    "id": f'{LAYER_ID}.{LAYER_VARIABLE}',
    "timestamps": [],  # will be injected
    "min_value": 0,
    "max_value": 150,
    "type": "tiles",  # 'tiles' or 'image'
    "zoom_levels": '0-11',
    "units": '',
    "basemap": 'blue',
    "legend_values": [
        {
        "value": "No data",
        "color": "rgb(0, 0, 0)"
        },
        {
        "value": "Tree cover evergreen broadleaf",
        "color": "rgb(0, 100, 0)"
        },
        {
        "value": "Tree cover evergreen needleleaf",
        "color": "rgb(0, 60, 0)"
        },
        {
        "value": "Tree cover deciduous broadleaf",
        "color": "rgb(0, 160, 0)"
        },
        {
        "value": "Tree cover deciduous needleleaf",
        "color": "rgb(40, 80, 0)"
        },
        {
        "value": "Shrub cover evergreen",
        "color": "rgb(150, 100, 0)"
        },
        {
        "value": "Shrub cover deciduous",
        "color": "rgb(170, 115, 0)"
        },
        {
        "value": "Grasslands",
        "color": "rgb(255, 180, 50)"
        },
        {
        "value": "Croplands",
        "color": "rgb(255, 255, 100)"
        },
        {
        "value": " Woody vegetation acquatic or regularly flooded",
        "color": "rgb(27, 203, 174)"
        },
        {
        "value": "Grassland vegetation acquatic or regularly flooded",
        "color": "rgb(0, 220, 130)"
        },
        {
        "value": "Lichens and mosses",
        "color": "rgb(255, 220, 210)"
        },
        {
        "value": "Bare areas",
        "color": "rgb(255, 245, 215)"
        },
        {
        "value": "Built-up",
        "color": "rgb(195, 20, 0)"
        },
        {
        "value": "Open water",
        "color": "rgb(0, 70, 200)"
        },
        {
        "value": "Open water seasonal",
        "color": "rgb(91, 149, 255)"
        },
        {
        "value": "Open water permanent",
        "color": "rgb(0, 70, 200)"
        },
        {
        "value": "Permanent snow and/or ice",
        "color": "rgb(255, 255, 255)"
        }
    ],
    "time_format": {
        "year": "numeric",
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
    "input_bucket_subdir": Param("Africa", type=["string"], enum=['Africa', 'Amazonia', 'Siberia']),
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
        color_file=COLOR_FILE, layer_type=METADATA['type'], zoom_levels=METADATA['zoom_levels'], gdal_ts=RESOLUTION)
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
