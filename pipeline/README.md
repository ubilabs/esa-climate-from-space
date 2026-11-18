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

### Local

To develop pipelines the best way to run Airflow is to start up the Docker Compose file under `/pipeline/docker-compose.yaml` with `docker-compose up`. This starts several containers with one beeing the webserver which can be reached at `http://localhost:8081`. To log into the UI use the username and password from the docker-compose file.

After logging in for the first time you need to set up a GCP connection under `Admin -> Connections`. Create a connection with the id `google` and connection type `Google Cloud`. In the Keyfile JSON field paste the JSON content of a service account keyfile which has permissions to read and write to the storage buckets.

The same keyfile has to be copied to `/pipeline/plugins/service-account.json`.

Now you can start a DAG by selecting a dataset variable under the `DAGs` menu and clicking the play button. The default value for `max_files` is set to "2" for fast iterative development. If you want to process the whole dataset set `max_files` to "0".

### GCP

Some datasets have very large files and need lots of processing power and RAM. If your local machine or internet connection is not capable of handling a dataset you can process it on a Compute Engine in the Google Cloud. Therefore just start up a VM from the prepared [snapshot](https://console.cloud.google.com/compute/snapshotsDetail/projects/esa-climate-from-space/global/snapshots/airflow-2026-11?project=esa-climate-from-space) `airflow-2026-11` (Debian 11, 1 TB disk, repo on `develop`, Airflow Docker images already built). The older snapshot `airflow-2024-01` (500 GB disk) is kept as a fallback.

The machine is not secure and costs money while it exists, so only create it for processing and delete it afterwards. Use the zone `europe-west3-a`: the buckets are in `europe-west3`, so transfers are fast and free. Example for Biomass (18 files of ~19 GB; ~14 h for the full run):

```bash
P=esa-climate-from-space; Z=europe-west3-a
gcloud compute disks create airflow --project $P --zone $Z --source-snapshot airflow-2026-11 --size 1000GB --type pd-balanced
gcloud compute instances create airflow --project $P --zone $Z --machine-type e2-highmem-16 \
  --disk name=airflow,boot=yes,auto-delete=yes --max-run-duration=48h --instance-termination-action=STOP
```

`--max-run-duration` stops the VM automatically as a safety net in case it is forgotten; raise it if a run needs longer. Airflow starts automatically on boot.

- **SSH:** `gcloud compute ssh airflow --zone $Z`. The repo is checked out at `/opt/esa/esa-climate-from-space/`. Update it with `sudo git pull` (it may also need `sudo git config --global --add safe.directory /opt/esa/esa-climate-from-space`); the UI picks up DAG changes a few seconds later.
- **UI:** port 8081 is not open in the firewall. Use an SSH tunnel and open `http://localhost:8081` (username and password from the docker-compose file):
  `gcloud compute ssh airflow --zone $Z -- -N -L 8081:localhost:8081`
- **Docker image:** don't rebuild it on the VM. The Dockerfile installs the aarch64 (Apple Silicon) Miniconda, which fails on the x86 VM. The prebuilt images work for the GDAL based DAGs.
- **Downloading source data:** the VM's Debian 11 is end of life and `apt` no longer works, but the Airflow containers have Python with `netCDF4` and `gcloud`. Copy the scripts from `/data/downloads` into `pipeline/workdir` (mounted as `/workdir`) and run them inside the worker container, e.g. `sudo docker exec -d pipeline-airflow-worker-1 bash -c "cd /workdir/scripts && python ceda-biomass-agb.py --output-dir /workdir/biomass-ceda > /workdir/scripts/download.log 2>&1"`. Then copy the files to `gs://esa-cfs-cate-data/{layer}/` with `gcloud storage cp --no-clobber`. Don't put downloads into `workdir/files`, which the DAG clears. To authenticate `gcloud` on the VM use `gcloud auth activate-service-account --key-file /opt/esa/esa-climate-from-space/pipeline/plugins/service-account.json`.
- **Long-running commands** keep running when the SSH session ends if started with `setsid nohup <command> > log 2>&1 < /dev/null &` (there is no `tmux`/`screen` on the VM). DAGs can be triggered from the command line too: `sudo docker exec pipeline-airflow-scheduler-1 airflow dags trigger <dag_id> --conf '{"max_files": 0, "output_bucket": "esa-cfs-tiles", "skip_downloads": false, "layer_version": "2.1.5"}'`.
- **Test first** with `max_files: 2` and `output_bucket: esa-cfs-pipeline-output` before writing to the live bucket.

When the tiles are uploaded, clean up so nothing keeps costing money:

```bash
# optional: save an updated machine (repo pulled etc.) as a new snapshot; clear the workdir first to keep it small
gcloud compute ssh airflow --zone $Z --command 'sudo rm -rf /opt/esa/esa-climate-from-space/pipeline/workdir/files/* && sudo fstrim -av'
gcloud compute instances stop airflow --zone $Z
gcloud compute snapshots create airflow-YYYY-MM --source-disk airflow --source-disk-zone $Z --storage-location europe-west3

# delete the VM together with its disk, then check that nothing is left
gcloud compute instances delete airflow --zone $Z
gcloud compute instances list; gcloud compute disks list
```
