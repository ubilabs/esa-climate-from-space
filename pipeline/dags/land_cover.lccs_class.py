from datetime import datetime
import task_factories
from airflow import DAG
from airflow.models.param import Param
from helper import get_default_layer_version

# layer
LAYER_ID = 'land_cover'
LAYER_VARIABLE = 'lccs_class'
RESOLUTION = '64800 32400'
EXTEND = '-180 -90 180 90'
METADATA = {
    "id": f'{LAYER_ID}.{LAYER_VARIABLE}',
    "timestamps": [], # will be injected
    "min_value": 0,
    "max_value": 220,
    "type": "tiles", # 'tiles' or 'image'
    "zoom_levels": '0-5',
    "units": '',
    "colorMap": "gist_rainbow",
    "basemap": 'blue',
    "filter": "nearest",
    "legend_values": [
        {
        "value": "No data",
        "color": " rgb(0, 0, 0)"
        },
        {
        "value": "Cropland, rainfed",
        "color": "rgb(255, 255, 100)"
        },
        {
        "value": "Herbaceous cover",
        "color": "rgb(255, 255, 100)"
        },
        {
        "value": "Tree or shrub cover",
        "color": "rgb(255, 255, 0)"
        },
        {
        "value": "Cropland, irrigated or post-flooding",
        "color": "rgb(170, 240, 240)"
        },
        {
        "value": "Mosaic cropland (>50%) / natural vegetation (tree, shrub, herbaceous cover) (<50%)",
        "color": "rgb(220, 240, 100)"
        },
        {
        "value": "Mosaic natural vegetation (tree, shrub, herbaceous cover) (>50%) / cropland (<50%)",
        "color": "rgb(200, 200, 100)"
        },
        {
        "value": "Tree cover, broadleaved, evergreen, closed to open (>15%)",
        "color": "rgb(0, 100, 0)"
        },
        {
        "value": "Tree cover, broadleaved, deciduous, closed to open (>15%)",
        "color": "rgb(0, 160, 0)"
        },
        {
        "value": "Tree cover, broadleaved, deciduous, closed (>40%)",
        "color": "rgb(0, 160, 0)"
        },
        {
        "value": "Tree cover, broadleaved, deciduous, open (15-40%)",
        "color": "rgb(170, 200, 0)"
        },
        {
        "value": "Tree cover, needleleaved, evergreen, closed to open (>15%)",
        "color": "rgb(0, 60, 0)"
        },
        {
        "value": "Tree cover, needleleaved, evergreen, closed (>40%)",
        "color": "rgb(0, 60, 0)"
        },
        {
        "value": "Tree cover, needleleaved, evergreen, open (15-40%)",
        "color": "rgb(0, 80, 0)"
        },
        {
        "value": "Tree cover, needleleaved, deciduous, closed to open (>15%)",
        "color": "rgb(40, 80, 0)"
        },
        {
        "value": "Tree cover, needleleaved, deciduous, closed (>40%)",
        "color": "rgb(40, 80, 0)"
        },
        {
        "value": "Tree cover, needleleaved, deciduous, open (15-40%)",
        "color": "rgb(40, 100, 0)"
        },
        {
        "value": "Tree cover, mixed leaf type (broadleaved and needleleaved)",
        "color": "rgb(120, 130, 0)"
        },
        {
        "value": "Mosaic tree and shrub (>50%) / herbaceous cover (<50%)",
        "color": "rgb(140, 160, 0)"
        },
        {
        "value": "Mosaic herbaceous cover (>50%) / tree and shrub (<50%)",
        "color": "rgb(190, 150, 0)"
        },
        {
        "value": "Shrubland",
        "color": "rgb(150, 100, 0)"
        },
        {
        "value": "Shrubland evergreen",
        "color": "rgb(120, 75, 0)"
        },
        {
        "value": "Shrubland deciduous",
        "color": "rgb(150, 100, 0)"
        },
        {
        "value": "Grassland",
        "color": "rgb(255, 180, 50)"
        },
        {
        "value": "Lichens and mosses",
        "color": "rgb(255, 220, 210)"
        },
        {
        "value": "Sparse vegetation (tree, shrub, herbaceous cover) (<15%)",
        "color": "rgb(255, 235, 175)"
        },
        {
        "value": "Sparse tree (<15%)",
        "color": "rgb(255, 200, 100)"
        },
        {
        "value": "Sparse shrub (<15%)",
        "color": "rgb(255, 210, 120)"
        },
        {
        "value": "Sparse herbaceous cover (<15%)",
        "color": "rgb(255, 235, 175)"
        },
        {
        "value": "Tree cover, flooded, fresh or brakish water",
        "color": "rgb(0, 120, 90)"
        },
        {
        "value": "Tree cover, flooded, saline water",
        "color": "gb(0, 150, 120)"
        },
        {
        "value": "Shrub or herbaceous cover, flooded, fresh/saline/brakish water",
        "color": "rgb(0, 220, 130)"
        },
        {
        "value": "Urban areas",
        "color": "rgb(195, 20, 0)"
        },
        {
        "value": "Bare areas",
        "color": "rgb(255, 245, 215)"
        },
        {
        "value": "Consolidated bare areas",
        "color": "rgb(220, 220, 220)"
        },
        {
        "value": "Unconsolidated bare areas",
        "color": "rgb(255, 245, 215)"
        },
        {
        "value": "Water bodies",
        "color": "rgb(0, 70, 200)"
        },
        {
        "value": "Permanent snow and ice",
        "color": "rgb(255, 255, 255)"
        }
    ],
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

    dry_run = False

    # create tasks
    clean_workdir = task_factories.clean_dir_skippable(task_id='clean_workdir', dir=WORKDIR)()
    list_files = task_factories.gcs_list_files(bucket_name=BUCKET_ORIGIN, layer_id=LAYER_ID, layer_variable=LAYER_VARIABLE)
    download = task_factories.gcs_download_file(bucket_name=BUCKET_ORIGIN, dir=WORKDIR, appendix='_downloaded')
    legend_image = task_factories.legend_image(workdir=WORKDIR, color_file=COLOR_FILE)
    metadata = task_factories.metadata(workdir=WORKDIR, metadata=METADATA)
    gdal_transforms = task_factories.gdal_transforms(layer_variable=LAYER_VARIABLE, color_file=COLOR_FILE, layer_type=METADATA['type'], zoom_levels=METADATA['zoom_levels'], gdal_ts=RESOLUTION, gdal_te=EXTEND, max_tis_warp=1, max_tis_dem=1, max_tis_translate=1)
    upload = task_factories.upload(WORKDIR, LAYER_ID, LAYER_VARIABLE, METADATA['type'])

    # connect tasks
    files = list_files()
    clean_workdir >> files
    downloads = download.expand(filename=files)
    gdal_transforms(downloads) >> upload()
    clean_workdir >> legend_image
    metadata(files)

    if DEBUG:
        downloads >> task_factories.gdal_info()
