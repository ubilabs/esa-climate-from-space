import json
from pathlib import Path
from datetime import datetime, timedelta
from airflow import DAG, XComArg
from airflow.models.param import Param
from airflow.operators.bash import BashOperator
from airflow.decorators import task, task_group
import shared

# layer
LAYER_ID = 'cloud'
LAYER_VARIABLE = 'cfc'
LAYER_VERSION = '1.2.3'
LAYER_TYPE = "tiles"
MIN_VALUE = 0
MAX_VALUE = 10
MAX_ZOOM = 7
UNIT = 'mg/m2'
BASEMAP = 'blue'
TIME_FORMAT = {
    "year": "numeric",
    "month": "long"
}
LEGEND_VALUES = ["100 %", "0"]

# dev
NUM_FILES = 10
BUCKET_ORIGIN = 'esa-cfs-cate-data'
BUCKET_TMP = 'esa-cfs-pipeline-tmp'
BUCKET_OUTPUT = 'esa-cfs-pipeline-output'
WORKDIR = '/tmp/files'
COLOR_FILE = f'/opt/airflow/plugins/colors/{LAYER_ID}.{LAYER_VARIABLE}.txt'


with DAG(dag_id="cloud.cfc", start_date=datetime(2022, 1, 1), schedule_interval=timedelta(days=1), catchup=False, params={
        "max_files": Param(2, type="integer", minimum=0),
    }) as dag:

    mk_workdir = BashOperator(
        task_id='mk_workdir',
        bash_command=f'rm -rf {WORKDIR} && mkdir -p {WORKDIR}'
    )



    @task()
    def list_files(**context):
        return shared.gcs_list(bucket_name=BUCKET_ORIGIN, layer_id=LAYER_ID, layer_variable=LAYER_VARIABLE, max_files=context["params"]["max_files"])()

    @task(task_id="download")
    def download(filename: str):
        return shared.gcs_download_file(bucket_name=BUCKET_ORIGIN, dir=WORKDIR, appendix='_downloaded')(filename)

    gdal_info = BashOperator(
        task_id='gdal_info',
        bash_command='gdalinfo $FILEPATH_IN',
        env={"FILEPATH_IN": "{{ task_instance.xcom_pull(task_ids='download', key='return_value')[0] }}"}
    )

    

    @task()
    def upload(filename: str):
        return shared.gcs_upload_file(bucket_name=BUCKET_OUTPUT, layer_id=LAYER_ID, layer_variable=LAYER_VARIABLE, layer_version=LAYER_VERSION)(filename)

    @task()
    def upload_metadata(filename: str):
        return shared.gcs_upload_file(bucket_name=BUCKET_OUTPUT, layer_id=LAYER_ID, layer_variable=LAYER_VARIABLE, layer_version=LAYER_VERSION)(filename)

    

    @task()
    def upload_debug(filename: str):
        return shared.gcs_upload_file(bucket_name=BUCKET_TMP, layer_id=LAYER_ID, layer_variable=LAYER_VARIABLE, layer_version=LAYER_VERSION)(filename)

    @task()
    def create_metadata_json(file_list: str):
        metadata = {
            "id": f'{LAYER_ID}.{LAYER_VARIABLE}',
            "minValue": MIN_VALUE,
            "maxValue": MAX_VALUE,
            "type": LAYER_TYPE,
            "zoomLevels": MAX_ZOOM,
            "timestamps": list(map(shared.filename_to_date, file_list)),
            "unit": UNIT,
            "basemap": BASEMAP,
            "timeFormat": TIME_FORMAT,
            "legendValues": LEGEND_VALUES
        }

        filepath = str(Path(WORKDIR).joinpath('metadata.json'))

        with open(filepath, "w") as f:
            f.write(json.dumps(metadata, indent=4))
            print(json.dumps(metadata, indent=4))

        return filepath


    # # connect tasks
    files = list_files()
    
    mk_workdir >> files

    @task_group()
    def group_metadata():
        upload_metadata(create_metadata_json(files))


    @task_group()
    def group_legend_image():
        @task()
        def upload_legend(filename: str):
            return shared.gcs_upload_file(bucket_name=BUCKET_OUTPUT, layer_id=LAYER_ID, layer_variable=LAYER_VARIABLE, layer_version=LAYER_VERSION)(filename)

        legend_image = BashOperator(
            task_id='create_legend_png',
            bash_command=f'rm -f $FILEPATH_OUT && node /opt/airflow/plugins/generate-legend-image.js && echo $FILEPATH_OUT',
            env={"FILEPATH_OUT": f'{WORKDIR}/legend.png', "COLOR_FILE": COLOR_FILE}
        )
        legend_image >> upload_legend(legend_image.output)

    group_metadata()
    mk_workdir >> group_legend_image()

    
    downloads = download.expand(filename=files)
    downloads >> gdal_info

    @task_group()
    def group_gdal(downloads):
        gdal_warp = BashOperator.partial(
            task_id='gdal_warp',
            bash_command='rm -f $FILEPATH_OUT && gdalwarp -t_srs EPSG:4326 -te -180 -90 180 90 -ts 1024 512 -r near --config GDAL_CACHEMAX 90% -co compress=LZW NETCDF:"$FILEPATH_IN":$DATA_VARIABLE $FILEPATH_OUT && echo $FILEPATH_OUT'
        )

        gdal_dem = BashOperator.partial(
            task_id='gdal_dem',
            bash_command='rm -f $FILEPATH_OUT && gdaldem color-relief $FILEPATH_IN $COLOR_FILE --config GDAL_CACHEMAX 90% -co compress=LZW -alpha $FILEPATH_OUT && echo $FILEPATH_OUT'
        )

        gdal_translate = BashOperator.partial(
            task_id='gdal_translate',
            bash_command='rm -f $FILEPATH_OUT && gdal_translate -of PNG $FILEPATH_IN $FILEPATH_OUT && echo $FILEPATH_OUT'
        )

        gdal_warps = gdal_warp.expand(
            env=downloads.map(lambda filename: {
                "FILEPATH_IN": filename,
                "FILEPATH_OUT": shared.change_filename(filename, appendix='warped', suffix='tiff'),
                "DATA_VARIABLE": LAYER_VARIABLE
            })
        )

        gdal_dems = gdal_dem.expand(
            env=gdal_warps.output.map(lambda filename: {
                "FILEPATH_IN": filename,
                "FILEPATH_OUT": shared.change_filename(filename, appendix='colored'),
                "COLOR_FILE": COLOR_FILE
            })
        )

        gdal_translates = gdal_translate.expand(
            env=gdal_dems.output.map(lambda filename: {
                "FILEPATH_IN": filename,
                "FILEPATH_OUT": shared.change_filename(filename, appendix='', suffix='png'),
            })
        )

        return gdal_translates

    

    # upload_debugs = upload_debug.expand(filename=gdal_dems.output)

    uploads = upload.expand(filename=XComArg(group_gdal(downloads)))

