#!/usr/bin/env bash

BASE_URL="ftp://anon-ftp.ceda.ac.uk/neodc/esacci/fire/data/burned_area/MODIS/grid/v5.1"
START_DATE=2001-01-01
OUTPUT_FOLDER=./download

for i in {0..4}
do
  NEXT_YEAR=$(date +%Y -d "$START_DATE + $i month")
  NEXT_DATE_SPACE=$(date +%Y%m%d -d "$START_DATE + $i month")
  FILENAME=$OUTPUT_FOLDER/$(date +%Y%m%d -d "$START_DATE + $i month").nc
  FTP_URL=$BASE_URL/$NEXT_YEAR/$NEXT_DATE_SPACE"-ESACCI-L4_FIRE-BA-MODIS-fv5.1.nc"
  echo $FTP_URL

  curl --silent $FTP_URL > $FILENAME

  python ./data/drop-unused-vars.py --file $FILENAME --variable burned_area
done
