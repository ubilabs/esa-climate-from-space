#!/usr/bin/env bash

TIMEOUT=16000
LAYER_ID="lakes.lswt"
VARIABLE_ID="lswt"
LAYER_TYPE="image"
VERSION="1.8.1"
LON_RES="4320"
LAT_RES="2160"
ZOOM_LEVELS="0-3"
MIN_LON="-180"
MAX_LON="360"
MIN_LAT="-90"
MAX_LAT="180"
MIN="auto"
MAX="auto"
MACHINE_TYPE="N1_HIGHCPU_8"

if [ ! -f ./package.json ]; then
    echo "You have to be in the root folder of the project to run this script!"
    exit 1
fi

gcloud --project esa-climate-from-space builds submit \
  --config ./ci/cloudbuild-tiles-reproject.yaml \
  --machine-type=$MACHINE_TYPE \
  --timeout=$TIMEOUT \
  --substitutions _LAYER_ID=$LAYER_ID,_VARIABLE_ID=$VARIABLE_ID,_ZOOM_LEVELS=$ZOOM_LEVELS,_LAYER_TYPE=$LAYER_TYPE,_LON_RES=$LON_RES,_LAT_RES=$LAT_RES,_VERSION=$VERSION,_MIN=$MIN,_MAX=$MAX,_MIN_LON=$MIN_LON,_MAX_LON=$MAX_LON,_MIN_LAT=$MIN_LAT,_MAX_LAT=$MAX_LAT \
  .
