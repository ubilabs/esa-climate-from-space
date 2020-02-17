# Tile Pyramid Generation

## Requirements

These tools are required to run the tile generation scripts in this folder:

- ESA CCI Toolbox (Cate) https://github.com/CCI-Tools/cate
- xcube https://xcube.readthedocs.io/en/latest/

Optional tools to work with and explore datasets:

- Cate Desktop (GUI for the ESA CCI Toolbox) https://github.com/CCI-Tools/cate-desktop
- Jupyter Lab

## Download dataset

see `download-zarr.py`

## Inspect zarr file

see `inspect-zarr.ipynb` (open with Jupyter Lab)

## Generate Tiles from zarr file

`xcube level ../cate/myzarr.zarr`
