#!/usr/bin/env bash

BASE_URL="https://owncloud.tuwien.ac.at/index.php/s/bY8j2kBgZlkqFYC/download?path=%2F&files=ESACCI-SOILMOISTURE-L3S-SSMV-MONTHLY_MEAN-COMBINED-19781101-20191231-fv04.7.nc"
OUTPUT_FODLER=./download/soil_moisture_anomaly

mkdir -p $OUTPUT_FODLER

FILENAME=$OUTPUT_FODLER/sma.nc
curl --silent $BASE_URL > $FILENAME

python ./data/split-time-dim.py --file $FILENAME --variable Anomaly

