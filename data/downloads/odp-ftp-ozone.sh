#!/usr/bin/env bash

BASE_URL="ftp://anon-ftp.ceda.ac.uk/neodc/esacci/ozone/data/total_columns/l3/merged/v0100"
START_DATE=2001-04-01
OUTPUT_FODLER=./download/ozone

mkdir -p $OUTPUT_FODLER

for i in {0..122}
do
  NEXT_YEAR=$(date +%Y -d "$START_DATE + $i month")
  NEXT_MONTH=$(date +%Y%m%d -d "$START_DATE + $i month")
  NEXT_DATE=$(date +%Y-%m-%d -d "$START_DATE + $i month")
  FILENAME=$OUTPUT_FODLER/$(date +%Y%m%d -d "$START_DATE + $i month").nc
  FTP_URL=$BASE_URL/$NEXT_YEAR/ESACCI-OZONE-L3S-TC-MERGED-DLR_1M-$NEXT_MONTH-fv0100.nc
  echo $FTP_URL

  curl --silent $FTP_URL > $FILENAME

  python ./data/drop-unused-vars.py --file $FILENAME --variable atmosphere_mole_content_of_ozone
  python ./data/add-time-coordinate.py --file $FILENAME --timestamp $NEXT_DATE
  python ./data/wrap-longitude.py --file $FILENAME
done
