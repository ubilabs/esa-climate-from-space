# Airflow Pipeline

The new (2023) Apache Airflow based pipeline is the successor of the previous Cloud Build based tile generation pipeline. Advantages are:

- Pipeline structure represented as python code
- Pipeline graph view
- Better performance with parallel task processing
- Faster and easier debugging
- Better pipeline customization for complex datasets (e.g. Sea Ice)

## Basics

[Apache Airflow](https://airflow.apache.org) is a well known task orchestration software which can author, schedule and monitor workflows. For our data pipeline we use Airflow to describe and run the tasks required to transform earth observation data in the form of NetCDF files to colored image tiles which are then rendered on a three dimensional globe.

Each dataset has it's own DAG (directed acyclic graph) file. This python file uses the Airflow API to build up a graph structure which describes each processing step. Steps can be processed sequentielly or in parallel. The DAG files can be found in `/pipeline/dags`. Many common tasks for this like download/upload of files from Google Cloud Storage or GDAL transforms have been moved into a library file which can be found at `/pipeline/dags/task_factories.py`.

Example DAG:
<img width="1546" alt="302652112-93a501e5-cdbf-4784-a987-147e0f32e031" src="https://github.com/ubilabs/esa-climate-from-space/assets/21622725/adb96770-8e93-47b6-bf7d-7a522e996990">

## DAGs and data flow

For now the Airflow pipelines start with downloading the (preprocessed) files from our GCS bucket `gs://esa-cfs-cate-data`. Note that the scripts to download these files from the data hub and upload to GCS are the same as for the old pipeline and can be found in `/data/downloads`. In the future these download tasks will probably also be implemented as Airflow DAGs. For now you can use the following command to run the download tasks in a Docker container suitable for this purpose: `docker run -it --rm --name cate -v $PWD/data:/data gcr.io/esa-climate-from-space/cate:latest bash`. In order to run download tasks using the
[ESA CCI Toolbox](https://climate.esa.int/en/data/toolbox/) (Python scripts in `/data/downloads` prefixed with `toolbox-`) you can use `docker run -it --rm --name toolbox -v $PWD/data:/data gcr.io/esa-climate-from-space/toolbox:latest bash` to start a Docker container, which has esa-climate-toolbox already preinstalled.

If you are logged in to the esa-climate-from-space project on GCP but you don't have the necessary permissions to access the docker image from the container artifactory, you can run the following command to authenticate: `gcloud auth configure-docker gcr.io`. The scripts can be found in the `data` folder and executed with `bash [scriptname]`.

As just mentioned each dataset DAG downloads the NetCDF files onto it's local HDD and creates image files. In the end, not only the final colored tiles but also a metadata file, legend image, zip file and an icon image will be uploaded to the specified bucket. We use `gs://esa-cfs-tiles` as the live bucket and `gs://esa-cfs-pipeline-output` as a test/debug bucket. The final files are versioned by including the version string in the destination path, e.g. `gs://esa-cfs-tiles/1.14.1/lakes.lswt`. The output bucket and version can be adjusted when starting a DAG in the UI.

All dataset DAGs are triggered manually by the developer. We don't use any form of automatic scheduling.

## Setup

### Fire Burned Area v5.1 Toolbox refresh

1. Download with `data/downloads/toolbox-fire.py` in the activated `esa-toolbox`
   environment. Use `--dry-run`, then `--max-files 1`, before a full export. Its
   output is `download/fire/v5.1/`; do not stage the manifest or regional samples.
2. Verify all **264 unique calendar months, January 2001–December 2022**, against
   the complete downloaded file set. The current development layer contains
   240 months through December 2020; all must be retained. Verify `burned_area`,
   units `m2`, and a global 1440 × 720 grid. Toolbox already supplies monthly
   area sums, so no additional averaging or unit conversion is appropriate.
3. Before replacing staged source files, back up `gs://esa-cfs-cate-data/fire.burned_area/`
   and inspect its contents. Stage only validated global NetCDFs there. Old files
   have month-start names; new files have actual mid-month source dates. Do not
   leave both sets in the prefix: this would duplicate months. Any source cleanup
   must be restricted to the backed-up, confirmed obsolete objects.
4. Manually trigger `fire.burned_area` with the defaults (`max_files=2`,
   `skip_downloads=false`, `output_bucket=esa-cfs-pipeline-output`) and a unique
   test `layer_version`. This DAG uses `/workdir/fire.burned_area`, allows only
   one active run, and waits for images, metadata and legend before packaging.
   Check its rendered images, metadata, icon, legend and `package.zip`.
5. For a full run, set `max_files=0`. Only after verification, back up the existing
   development output `gs://esa-cfs-tiles/2.1.5/fire.burned_area/` before replacing
   it. Check 264 ordered timestamps, 264 images, the four ancillary objects and
   uploaded checksums; inspect the offline ZIP as well. Version prefix **2.1.5
   is development**, despite the bucket name. Do not publish a two-file test to
   that prefix.

The source product remains release **5.1**; the refresh adds 2021–2022 to the old
2001–2020 series. Toolbox exports source interval midpoints (15th/16th), not
the previous month-start labels. The image DAG derives dates from filenames,
normalizing any source noon timestamp to midnight. Report this exact-date change
and review consumers before publication; calendar-month coverage is preserved.
Live checks confirmed that October–December 2019 are read from the provider's
`new-corrected` files, as required by the legacy FTP downloader.

Keep the layer description's existing version/coverage unchanged until the new
output is actually published; then update the documented coverage accordingly.

### Local

To develop pipelines the best way to run Airflow is to start up the Docker Compose file under `/pipeline/docker-compose.yaml` with `docker-compose up`. This starts several containers with one beeing the webserver which can be reached at `http://localhost:8081`. To log into the UI use the username and password from the docker-compose file.

After logging in for the first time you need to set up a GCP connection under `Admin -> Connections`. Create a connection with the id `google` and connection type `Google Cloud`. In the Keyfile JSON field paste the JSON content of a service account keyfile which has permissions to read and write to the storage buckets.

The same keyfile has to be copied to `/pipeline/plugins/service-account.json`.

Now you can start a DAG by selecting a dataset variable under the `DAGs` menu and clicking the play button. The default value for `max_files` is set to "2" for fast iterative development. If you want to process the whole dataset set `max_files` to "0".

### GCP

Some datasets have very large files and need lots of processing power and RAM. If your local machine or internet connection is not capable of handling a dataset you can process it on a Compute Engine in the Google Cloud. Therefore just start up a VM from the prepared [snapshot](https://console.cloud.google.com/compute/snapshotsDetail/projects/esa-climate-from-space/global/snapshots/airflow-2024-01?project=esa-climate-from-space).

Once started you can reach the UI of the VM at `http://{EXTERNAL_IP}:8081`. To log into the UI use the username and password from the docker-compose file..

Please note that the machine is not secure and should only be running it while processing the data. You can safely delete the machine after the final image tiles have been uploaded. If you SSH into the machine you can find the checked out git repo at `/opt/esa/`. To update the DAG files pull from origin and the UI will update a few seconds later.
