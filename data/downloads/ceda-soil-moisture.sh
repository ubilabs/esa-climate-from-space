#!/usr/bin/env bash

BASE_URL="https://data.ceda.ac.uk/neodc/esacci/soil_moisture/data/daily_files/COMBINED/v08.1"


START_DATE=1978-11-01
OUTPUT_FOLDER=./downloads/download/soilmoisture

mkdir -p $OUTPUT_FOLDER

for i in {0..529}
do
  NEXT_YEAR=$(date +%Y -d "$START_DATE + $i month")
  NEXT_DATE_SPACE=$(date +%Y%m%d -d "$START_DATE + $i month")
  FILENAME=$OUTPUT_FOLDER/$(date +%Y%m%d -d "$START_DATE + $i month").nc
  URL=$BASE_URL/$NEXT_YEAR/"ESACCI-SOILMOISTURE-L3S-SSMV-COMBINED-"$NEXT_DATE_SPACE"000000-fv08.1.nc"
  echo $URL

  curl --silent -L $URL > $FILENAME

  #python ./drop-unused-vars.py --file $FILENAME --variable sm
done


