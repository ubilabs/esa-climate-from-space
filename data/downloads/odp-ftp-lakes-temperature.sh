#!/usr/bin/env bash

BASE_URL="http://dap.ceda.ac.uk/neodc/esacci/lakes/data/lake_products/L3S/v1.0/"
START_DATE=1992-10-01
OUTPUT_FOLDER=./download/lakes-temperature

mkdir -p $OUTPUT_FOLDER

for i in {0..23}
do
  NEXT_YEAR=$(date +%Y -d "$START_DATE + $i month")
  NEXT_DATE=$(date +%Y%m%d -d "$START_DATE + $i month")
  FILENAME=$OUTPUT_FOLDER/$NEXT_DATE.nc
  FTP_URL=$BASE_URL/$NEXT_YEAR/ESACCI-LAKES-L3S-LK_PRODUCTS-MERGED-$NEXT_DATE-fv1.0.nc
  echo $FTP_URL

  curl --silent $FTP_URL > $FILENAME

  python ./data/drop-unused-vars.py --file $FILENAME --variable lake_surface_water_temperature
done
