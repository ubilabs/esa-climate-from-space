# Tile generation steps

## Download Data

- We download the netcdf files we are interested in from the ODP FTP server and upload them to our Cloud storage. See example script: https://github.com/ubilabs/esa-climate-from-space/blob/develop/data/downloads/odp-ftp-ozone.sh

Notes:

- For files with a lot of variables we drop all other variables before uploading them to reduce the file size
  (see https://github.com/ubilabs/esa-climate-from-space/blob/develop/data/drop-unused-vars.py)
- Some datasets do not have a time dimension so we add it based on the filename
  (see https://github.com/ubilabs/esa-climate-from-space/blob/develop/data/add-time-coordinate.py)
  Datasets with this problem:

  - aerosol
  - biomass
  - greenland-ice
  - land-cover
  - ozone
  - permafrost
  - sea_level,
  - greenhouse xch4
  - greenhouse xco2

- Some datasets have very large or small numbers instead of nan values. We mask them to get transparency for these values (https://github.com/ubilabs/esa-climate-from-space/blob/develop/data/mask-values.py)

  Datasets with this problem:

  - sea_state
  - greenhouse xch4
  - greenhouse xco2

## Cloud workflow with xcube and gdal

This Google Cloud Build workflow is defined here: https://github.com/ubilabs/esa-climate-from-space/blob/develop/ci/cloudbuild-tiles.yaml

### 1. Download data

- Download the netcdf files from Cloud storage into the container's mounted volume

### 2. Load into cate

see https://github.com/ubilabs/esa-climate-from-space/blob/develop/data/write-zarr.py

- Add files with `local_store.add_pattern(id, files_pattern)`
- Open dataset with `cate.ops.open_dataset(id, var_names=variable_id)`
- Read metadata like units, min/max values, timesteps, etc.
- Re-chunk to full size chunks per timestep so that xcube automatically creates full size images
- Write zarr cube
- Write style file for xcube
- Write worldfile for gdal
- Write metadata file for out frontend app with timesteps, colormap, min/max, zoom-levels etc.

### 3. Generate fullsize images with xcube

- `xcube tile --verbose --config ./style.yaml --style cfs --output /data/images /data/dataset.zarr`
- We only generate one large image per timestamp here because tiling takes too long with xcube - when xcube performance improves we can do the tiling here too without the next gdal step

### 4. Generate tiles with gdal

see https://github.com/ubilabs/esa-climate-from-space/blob/develop/data/gdal-tiles.sh

- Use gdal2tiles to generate tiles for every timestep

### 5. Generate upload folder

see https://github.com/ubilabs/esa-climate-from-space/blob/develop/data/prepare-tile-upload.sh

- Make a zip with all tiles for offline usage
- Move and rename files
- Delete unnecessary files

### 6. Upload files

- Upload files into our "esa-cfs-tiles" bucket

## Cloud workflow with gdal only

This Google Cloud Build workflow is defined here: https://github.com/ubilabs/esa-climate-from-space/blob/develop/ci/cloudbuild-tiles-reproject.yaml

For some datasets (mostly those with different projections or very large ones) we had to switch to gdal to reproject the data. We still use cate here for the "Load into cate" step to read the timesteps and other metadata values. But instead of writing a zarr file and load it into xcube to generate tiles we directly switch to gdal and generate images from the NetCDF files.

Datasets which require this workflow for now:

- biomass
- greenland_ice
- greenhouse xch4 (needed extra work)
- greenhouse xco2 (needed extra work)
- land_cocer
- permafrost
- sea_ice_nh
- sea_ice_sh
- sea_surface_salinity

### 1. Download data

- Download the netcdf files from Cloud storage into the container's mounted volume

### 2. Load into cate

see https://github.com/ubilabs/esa-climate-from-space/blob/develop/data/write-zarr.py

- Add files with `local_store.add_pattern(id, files_pattern)`
- Open dataset with `cate.ops.open_dataset(id, var_names=variable_id)`
- Read metadata like units, min/max values, timesteps, etc.
- Write style file for xcube
- Write worldfile for gdal
- Write metadata file for out frontend app with timesteps, colormap, min/max, zoom-levels etc.

### 3. Reproject data

see https://github.com/ubilabs/esa-climate-from-space/blob/develop/data/gdal-reproject.sh

- Set source projection (this step is only required for "sea_surface_salinity") `gdal_translate -of NETCDF -a_srs $SOURCE_PROJECTION -a_ullr $SOURCE_BOUNDS ...`
- Reproject `gdalwarp -t_srs EPSG:4326 ...`
- Colorize `gdaldem color-relief ...`
- Genrate tiles `gdal2tiles.py ...`

Notes: Some datasets have a very high resolution. For these we reduce the output size in gdalwarp with `-ts xRes yRes`. This is the case for:

- biomass
- land_cover

### 4. Generate upload folder

see https://github.com/ubilabs/esa-climate-from-space/blob/develop/data/prepare-tile-upload.sh

- Make a zip with all tiles for offline usage
- Move and rename files
- Delete unnecessary files

### 5. Upload files

- Upload files into our "esa-cfs-tiles" bucket
