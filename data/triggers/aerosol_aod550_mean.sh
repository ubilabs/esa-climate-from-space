#!/usr/bin/env bash

TIMEOUT=4000
LAYER_ID="aerosol.AOD550_mean"
VARIABLE_ID="AOD550_mean"
LAYER_TYPE="image"
VERSION="1.7.1"
LON_RES="360"
LAT_RES="180"
ZOOM_LEVELS="0-3"
MIN_LON="-180"
MAX_LON="180"
MIN_LAT="-90"
MAX_LAT="90"
MIN="0"
MAX="1"
MACHINE_TYPE="N1_HIGHCPU_8"

if [ ! -f ./package.json ]; then
    echo "You have to be in the root folder of the project to run this script!"
    exit 1
fi

# --machine-type=$MACHINE_TYPE \
gcloud --project esa-climate-from-space builds submit \
  --config ./ci/cloudbuild-tiles-reproject.yaml \
  --timeout=$TIMEOUT \
  --substitutions _LAYER_ID=$LAYER_ID,_VARIABLE_ID=$VARIABLE_ID,_ZOOM_LEVELS=$ZOOM_LEVELS,_LAYER_TYPE=$LAYER_TYPE,_LON_RES=$LON_RES,_LAT_RES=$LAT_RES,_VERSION=$VERSION,_MIN=$MIN,_MAX=$MAX,_MIN_LON=$MIN_LON,_MAX_LON=$MAX_LON,_MIN_LAT=$MIN_LAT,_MAX_LAT=$MAX_LAT \
  .
