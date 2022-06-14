#!/usr/bin/env bash

BASE_URL="https://dap.ceda.ac.uk/neodc/esacci/soil_moisture/data/daily_files/COMBINED/v06.1"

START_DATE=1978-11-01
OUTPUT_FOLDER=./download/soilmoisture

mkdir -p $OUTPUT_FOLDER

for i in {0..505}
do
  NEXT_YEAR=$(date +%Y -d "$START_DATE + $i month")
  NEXT_DATE_SPACE=$(date +%Y%m%d -d "$START_DATE + $i month")
  FILENAME=$OUTPUT_FOLDER/$(date +%Y%m%d -d "$START_DATE + $i month").nc
  URL=$BASE_URL/$NEXT_YEAR/"ESACCI-SOILMOISTURE-L3S-SSMV-COMBINED-"$NEXT_DATE_SPACE"000000-fv06.1.nc"
  echo $URL

  curl --silent $URL > $FILENAME

  python ./data/drop-unused-vars.py --file $FILENAME --variable sm
done


