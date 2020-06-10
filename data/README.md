# Tile Pyramid Generation

## Requirements

These tools are required to run the tile generation scripts in this folder:

- ESA CCI Toolbox (Cate) https://github.com/CCI-Tools/cate
- xcube https://xcube.readthedocs.io/en/latest/

Optional tools to work with and explore datasets:

- Cate Desktop (GUI for the ESA CCI Toolbox) https://github.com/CCI-Tools/cate-desktop
- Jupyter Lab

## Generate Tiles from zarr file

`xcube tiles ../cate/myzarr.zarr`

## CI Pipeline

The cloud build task `cloudbuild-tiles` runs several docker containers to produce
tiles for a given dataset and variable Id. The result of the pipeline is a folder
in the cloud storage bucket `gs://esa-cfs-tiles/{VERSION}/{LAYER_ID}`.

The folder includes:

- tiles and a full global image for every timestamp
- metadata.json with timestamp mappings
- a `package.zip` with the above data to download for offline mode
