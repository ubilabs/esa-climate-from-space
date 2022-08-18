#!/usr/bin/env bash

FOLDER=./download/lakes

set -e

for filename in $FOLDER/*.tif; do
  TIF_FILENAME=$filename
  NC_FILENAME=${filename%.*}.nc
  echo $TIF_FILENAME
    python ./data/tif2netcdf.py -v lswt -f $TIF_FILENAME -o $NC_FILENAME
done
