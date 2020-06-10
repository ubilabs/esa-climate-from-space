#!/usr/bin/env bash

gsutil -m cp gs://esa-cfs-cate-data/greenhouse.xco2/* ./download

START_DATE=2003-01-01
OUTPUT_FODLER=./download

for i in {0..191}
do
  NEXT_MONTH=$(date +%Y-%m -d "$START_DATE + $i month")
  NEXT_DATE=$(date +%Y%m%d -d "$START_DATE + $i month")
  FILENAME=$OUTPUT_FODLER/xco2_$NEXT_MONTH.tif
  NETCDF=$OUTPUT_FODLER/$NEXT_DATE.nc
  echo $FILENAME

  python ./data/tif2netcdf.py --file $FILENAME --output $NETCDF --variable xco2
  python ./data/mask-values.py --file $NETCDF --variable xco2 --min "-100"
  python ./data/add-time-coordinate.py --file $NETCDF --timestamp $NEXT_DATE
done
