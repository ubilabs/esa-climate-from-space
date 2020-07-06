#!/usr/bin/env bash

TIMEOUT=12000
LAYER_ID="oc.chlor_a"
VARIABLE_ID="chlor_a"
VERSION="0.5.1"
ZOOM_LEVELS="0-3"
MIN_LON="-180"
MAX_LON="180"
MIN_LAT="-90"
MAX_LAT="90"
MIN=0
MAX=2
MACHINE_TYPE="N1_HIGHCPU_8"

if [ ! -f ./package.json ]; then
    echo "You have to be in the root folder of the project to run this script!"
    exit 1
fi

gcloud builds submit --config ./ci/cloudbuild-tiles-reproject.yaml \
  --machine-type=$MACHINE_TYPE \
  --timeout=$TIMEOUT \
  --substitutions _LAYER_ID=$LAYER_ID,_VARIABLE_ID=$VARIABLE_ID,_ZOOM_LEVELS=$ZOOM_LEVELS,_VERSION=$VERSION,_MIN=$MIN,_MAX=$MAX,_MIN_LON=$MIN_LON,_MAX_LON=$MAX_LON,_MIN_LAT=$MIN_LAT,_MAX_LAT=$MAX_LAT \
  .
