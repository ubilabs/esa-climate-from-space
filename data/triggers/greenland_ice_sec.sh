#!/usr/bin/env bash

TIMEOUT=2000
LAYER_ID="greenland_ice.sec"
VARIABLE_ID="SEC"
VERSION="0.4.1"
ZOOM_LEVELS="0-3"
MIN_LON="-90"
MAX_LON="7.594643368591434"
MIN_LAT="58.854580820213855"
MAX_LAT="84.00492144822202"
MIN="auto"
MAX="auto"
MACHINE_TYPE="N1_HIGHCPU_8"

if [ ! -f ./package.json ]; then
    echo "You have to be in the root folder of the project to run this script!"
    exit 1
fi

# --machine-type=$MACHINE_TYPE \
gcloud builds submit --config ./ci/cloudbuild-tiles-reproject.yaml \
  --timeout=$TIMEOUT \
  --substitutions _LAYER_ID=$LAYER_ID,_VARIABLE_ID=$VARIABLE_ID,_ZOOM_LEVELS=$ZOOM_LEVELS,_VERSION=$VERSION,_MIN=$MIN,_MAX=$MAX,_MIN_LON=$MIN_LON,_MAX_LON=$MAX_LON,_MIN_LAT=$MIN_LAT,_MAX_LAT=$MAX_LAT \
  .
