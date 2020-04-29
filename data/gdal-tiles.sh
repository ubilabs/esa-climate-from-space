#!/usr/bin/env bash

zoom_levels=$1

for file in $(find /data/images/* -name 0.png | sort -n); do
  echo $file

  timestamp_dir=$(realpath $(dirname $file)/../..)

  # copy worldfile next to the image so that gdal recognizes it
  cp worldfile.wld $timestamp_dir/0/0/0.pgw

  # create tiles into timestamp folder
  gdal2tiles.py \
    --profile geodetic \
    --zoom=$zoom_levels \
    --no-kml \
    --webviewer=none \
    --resampling near \
    --tmscompatible \
    --s_srs EPSG:4326 \
    --processes=8 \
     --quiet \
    $file $timestamp_dir
done
