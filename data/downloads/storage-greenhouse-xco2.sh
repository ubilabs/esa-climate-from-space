#!/usr/bin/env bash

OUTPUT_FOLDER=./download/xco2
gsutil -m cp gs://esa-cfs-cate-data/greenhouse.xco2/* $OUTPUT_FOLDER

START_DATE=2003-01-01

pip install rasterio

for i in {0..191}
do
  NEXT_MONTH=$(date +%Y-%m -d "$START_DATE + $i month")
  NEXT_DATE=$(date +%Y%m%d -d "$START_DATE + $i month")
  FILENAME=$OUTPUT_FOLDER/xco2_$NEXT_MONTH.tif
  NETCDF=$OUTPUT_FOLDER/$NEXT_DATE.nc
  echo $FILENAME

  python ./data/tif2netcdf.py --file $FILENAME --output $NETCDF --variable xco2
  python ./data/mask-values.py --file $NETCDF --variable xco2 --min "-100"
  python ./data/add-time-coordinate.py --file $NETCDF --timestamp $NEXT_DATE
done
