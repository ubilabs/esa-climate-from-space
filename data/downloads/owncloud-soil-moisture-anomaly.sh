#!/usr/bin/env bash

BASE_URL="https://owncloud.tuwien.ac.at/index.php/s/bY8j2kBgZlkqFYC/download?path=%2F&files=ESA_CCI_SM_v06.2_COMBINED_Anomalies.nc"
OUTPUT_FOLDER=./download/soil_moisture_anomaly

mkdir -p $OUTPUT_FOLDER

FILENAME=$OUTPUT_FOLDER/sma.nc
curl --silent $BASE_URL > $FILENAME

python ./data/split-time-dim.py --file $FILENAME --folder $OUTPUT_FOLDER --variable Anomaly

