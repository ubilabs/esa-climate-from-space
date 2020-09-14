#!/usr/bin/env bash

TIMEOUT=10000
LAYER_ID="biomass.agb"
VARIABLE_ID="agb"
LAYER_TYPE="tiles"
VERSION="0.9.1"
LON_RES="81000"
LAT_RES="31500"
ZOOM_LEVELS="0-7"
MIN_LON="-180"
MAX_LON="180"
MIN_LAT="-60"
MAX_LAT="80"
MIN="0"
MAX="350"
MACHINE_TYPE="N1_HIGHCPU_32"

if [ ! -f ./package.json ]; then
    echo "You have to be in the root folder of the project to run this script!"
    exit 1
fi

gcloud builds submit --config ./ci/cloudbuild-tiles-reproject.yaml \
  --machine-type=$MACHINE_TYPE \
  --timeout=$TIMEOUT \
  --substitutions _LAYER_ID=$LAYER_ID,_VARIABLE_ID=$VARIABLE_ID,_ZOOM_LEVELS=$ZOOM_LEVELS,_LAYER_TYPE=$LAYER_TYPE,_LON_RES=$LON_RES,_LAT_RES=$LAT_RES,_VERSION=$VERSION,_MIN=$MIN,_MAX=$MAX,_MIN_LON=$MIN_LON,_MAX_LON=$MAX_LON,_MIN_LAT=$MIN_LAT,_MAX_LAT=$MAX_LAT \
  .
