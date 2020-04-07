#!/usr/bin/env bash

size_gdal=8192 # rescale to next zoom level for gdal
size_full=2048 # full world image to use in app

for file in $(find /data/images/* -name 0.png | sort -n); do
  timestamp_dir=$(realpath $(dirname $file)/../..)
  convert -resize $size_gdal -interpolate nearest-neighbor $file $timestamp_dir/gdal.png
  convert -resize $size_full -interpolate nearest-neighbor $file $timestamp_dir/full.png
done
