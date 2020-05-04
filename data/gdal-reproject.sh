#!/usr/bin/env bash

VARIABLE=$1
ZOOM_LEVELS=$2
OUT_BOUNDS=$3
SOURCE_PROJECTION=$4
SOURCE_BOUNDS=$5
TRIMMED_SOURCE_BOUNDS=$(echo $SOURCE_BOUNDS | sed 's/ *$//g')
FOLDER=/data/netcdfs/
timestamp_counter=0

for file in $(find $FOLDER -name *.nc -type f | sort -n); do
  echo "--------------"
  echo $file

  if [ ! -z "$SOURCE_PROJECTION" ] && [ ! -z "$TRIMMED_SOURCE_BOUNDS" ]
  then
      echo "Updating projection information"
      # if defined set projection and bounds in netcdf file
      gdal_translate \
        -of NETCDF \
        -a_srs $SOURCE_PROJECTION \
        -a_ullr $TRIMMED_SOURCE_BOUNDS \
        NETCDF:\"$file\":$VARIABLE \
        $file
  fi

  gdalwarp \
    -t_srs EPSG:4326 \
    -te $OUT_BOUNDS \
    -r near \
    --config GDAL_CACHEMAX 90% \
    -co compress=LZW \
    NETCDF:\"$file\":$VARIABLE \
    ./tmp.tif

  gdaldem\
    color-relief \
    ./tmp.tif \
    ./data/gdal-colors/colors-$VARIABLE.txt \
    --config GDAL_CACHEMAX 90% \
    -co compress=LZW \
    -alpha ./colored.tif

  gdal2tiles.py \
    --profile geodetic \
    --zoom=$ZOOM_LEVELS \
    --tmscompatible \
    --no-kml \
    --webviewer=none \
    --resampling near \
    --s_srs EPSG:4326 \
    ./colored.tif /data/images/$VARIABLE/$timestamp_counter

  rm ./tmp.tif
  rm ./colored.tif

  timestamp_counter=$((timestamp_counter+1))
done



