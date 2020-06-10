#!/usr/bin/env bash

BASE_URL="ftp://anon-ftp.ceda.ac.uk/neodc/esacci/soil_moisture/data/daily_files/COMBINED/v04.5"
START_DATE=1987-11-01
OUTPUT_FODLER=./download

for i in {0..5}
do
  NEXT_YEAR=$(date +%Y -d "$START_DATE + $i month")
  NEXT_MONTH=$(date +%Y%m%d -d "$START_DATE + $i month")
  FILENAME=$OUTPUT_FODLER/$(date +%Y%m%d -d "$START_DATE + $i month").nc
  FTP_URL="$BASE_URL/$NEXT_YEAR/ESACCI-SOILMOISTURE-L3S-SSMV-COMBINED-$NEXT_MONTH"000000-fv04.5.nc
  echo $FTP_URL

  curl --silent $FTP_URL > $FILENAME

  python ./data/drop-unused-vars.py --file $FILENAME --variable sm
done
