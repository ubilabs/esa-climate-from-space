#!/usr/bin/env bash

# Usage: ./basemap-tiles.sh <input-file> <output-folder>
# with Docker: docker run -v `pwd`:/data -w /data --name gdal2 -it --rm geographica/gdal2 ./basemap-tiles <input-file> <output-folder>

# Images and worldfiles can be found here: https://drive.google.com/drive/folders/15UR1BBZRVPvLlvPF3s5yYNqpdmd6PMcF
# Upload tiles with: gsutil -m cp -r ./<output-folder>/ gs://esa-cfs-tiles/<version>/basemaps/<name>

input=$1
output=$2

gdal2tiles.py \
  --profile geodetic \
  --zoom=$ZOOM_LEVELS \
  --tmscompatible \
  --no-kml \
  --webviewer=none \
  --resampling average \
  --s_srs EPSG:4326 \
  $input \
  $output

find $output -name '*.kml' -delete
find $output -name '*.aux.xml' -delete
find $output -name '*.json' -delete
