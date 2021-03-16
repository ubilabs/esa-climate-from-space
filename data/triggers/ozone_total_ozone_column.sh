#!/usr/bin/env bash

TIMEOUT=12000
LAYER_ID="ozone.total_ozone_column"
VARIABLE_ID="total_ozone_column"
LAYER_TYPE="image"
VERSION="0.11.3"
LON_RES="720"
LAT_RES="360"
ZOOM_LEVELS="0-3"
MIN_LON="-180"
MAX_LON="180"
MIN_LAT="-90"
MAX_LAT="90"
MIN="100"
MAX="500"

if [ ! -f ./package.json ]; then
    echo "You have to be in the root folder of the project to run this script!"
    exit 1
fi

gcloud --project esa-climate-from-space builds submit \
  --config ./ci/cloudbuild-tiles-reproject.yaml \
  --timeout=$TIMEOUT \
  --substitutions _LAYER_ID=$LAYER_ID,_VARIABLE_ID=$VARIABLE_ID,_ZOOM_LEVELS=$ZOOM_LEVELS,_LON_RES=$LON_RES,_LAT_RES=$LAT_RES,_LAYER_TYPE=$LAYER_TYPE,_VERSION=$VERSION,_MIN=$MIN,_MAX=$MAX,_MIN_LON=$MIN_LON,_MAX_LON=$MAX_LON,_MIN_LAT=$MIN_LAT,_MAX_LAT=$MAX_LAT \
  .
