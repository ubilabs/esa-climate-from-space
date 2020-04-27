#!/usr/bin/env bash

VARIABLE=$1
BOUNDS=$2
ZOOM_LEVELS=$3
FOLDER=/data/netcdfs/
counter=0

for file in $(find $FOLDER -name *.nc -type f | sort -n); do
  echo "--------------"
  echo $file

  gdalwarp \
    -t_srs EPSG:4326 \
    -te $BOUNDS \
    NETCDF:\"$file\":$VARIABLE \
    ./tmp.tif

  gdaldem\
    color-relief \
    ./tmp.tif \
    ./data/gdal-colors/colors-$VARIABLE.txt \
    -alpha ./colored.tif

  gdal2tiles.py \
    --profile geodetic \
    --zoom=$ZOOM_LEVELS \
    --tmscompatible \
    --no-kml \
    --webviewer=none \
    --resampling near \
    --s_srs EPSG:4326 \
    ./colored.tif /data/images/$VARIABLE/$counter

  rm ./tmp.tif
  rm ./colored.tif

  counter=$((counter+1))
done



