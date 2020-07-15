#!/usr/bin/env bash

TIMEOUT=12000
LAYER_ID="sst.analysed_sst"
VARIABLE_ID="analysed_sst"
VERSION="0.6.1"
ZOOM_LEVELS="0-4"
MIN="-5"
MAX="35"
MACHINE_TYPE="N1_HIGHCPU_32"

if [ ! -f ./package.json ]; then
    echo "You have to be in the root folder of the project to run this script!"
    exit 1
fi

gcloud builds submit --config ./ci/cloudbuild-tiles.yaml \
  --machine-type=$MACHINE_TYPE \
  --timeout=$TIMEOUT \
  --substitutions _LAYER_ID=$LAYER_ID,_VARIABLE_ID=$VARIABLE_ID,_ZOOM_LEVELS=$ZOOM_LEVELS,_VERSION=$VERSION,_MIN=$MIN,_MAX=$MAX \
  .
