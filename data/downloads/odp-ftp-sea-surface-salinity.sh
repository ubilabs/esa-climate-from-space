#!/usr/bin/env bash

BASE_URL="ftp://anon-ftp.ceda.ac.uk/neodc/esacci/sea_surface_salinity/data/v01.8/30days"
START_DATE=2010-01-01
OUTPUT_FODLER=./download/sss

mkdir -p $OUTPUT_FODLER

for i in {0..106}
do
  NEXT_YEAR=$(date +%Y -d "$START_DATE + $i month")
  NEXT_DATE=$(date +%Y%m%d -d "$START_DATE + $i month")
  FILENAME=$OUTPUT_FODLER/$(date +%Y%m%d -d "$START_DATE + $i month").nc
  FTP_URL=$BASE_URL/$NEXT_YEAR/ESACCI-SEASURFACESALINITY-L4-SSS-MERGED_OI_Monthly_CENTRED_15Day_25km-$NEXT_DATE-fv1.8.nc
  echo $FTP_URL

  curl --silent $FTP_URL > $FILENAME

  python ./data/drop-unused-vars.py --file $FILENAME --variable sss
done
