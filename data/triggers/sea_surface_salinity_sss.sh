#!/usr/bin/env bash

TIMEOUT=4000
LAYER_ID="sea_surface_salinity.sss"
VARIABLE_ID="sss"
LAYER_TYPE="image"
VERSION="1.0.1"
LON_RES="1388"
LAT_RES="694"
ZOOM_LEVELS="0-3"
MIN="32"
MAX="38"
MIN_LON="-179.25"
MAX_LON="179.25"
MIN_LAT="-90"
MAX_LAT="90"
SOURCE_PROJECTION="EPSG:3410"
SOURCE_MIN_X="-17324563.84"
SOURCE_MAX_X="17324563.84"
SOURCE_MIN_Y="-7338939.46"
SOURCE_MAX_Y="7338939.46"

if [ ! -f ./package.json ]; then
    echo "You have to be in the root folder of the project to run this script!"
    exit 1
fi

gcloud --project esa-climate-from-space builds submit \
  --config ./ci/cloudbuild-tiles-reproject.yaml \
  --timeout=$TIMEOUT \
  --substitutions _LAYER_ID=$LAYER_ID,_VARIABLE_ID=$VARIABLE_ID,_ZOOM_LEVELS=$ZOOM_LEVELS,_LAYER_TYPE=$LAYER_TYPE,_LON_RES=$LON_RES,_LAT_RES=$LAT_RES,_VERSION=$VERSION,_MIN=$MIN,_MAX=$MAX,_MIN_LON=$MIN_LON,_MAX_LON=$MAX_LON,_MIN_LAT=$MIN_LAT,_MAX_LAT=$MAX_LAT,_SOURCE_PROJECTION=$SOURCE_PROJECTION,_SOURCE_BOUNDS=$SOURCE_BOUNDS,_SOURCE_MIN_X=$SOURCE_MIN_X,_SOURCE_MAX_X=$SOURCE_MAX_X,_SOURCE_MIN_Y=$SOURCE_MIN_Y,_SOURCE_MAX_Y=$SOURCE_MAX_Y \
  .
