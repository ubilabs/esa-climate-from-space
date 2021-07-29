#!/usr/bin/env bash

BASE_URL="https://owncloud.tuwien.ac.at/index.php/s/bY8j2kBgZlkqFYC/download?path=%2F&files=ESACCI-SOILMOISTURE-L3S-SSMV-MONTHLY_MEAN-COMBINED-19781101-20191231-fv05.2.nc"
OUTPUT_FOLDER=./download/soil_moisture

mkdir -p $OUTPUT_FOLDER

FILENAME=$OUTPUT_FOLDER/sm.nc
curl --silent $BASE_URL > $FILENAME

python ./data/split-time-dim.py --file $FILENAME --folder $OUTPUT_FOLDER --variable sm_mean

