#!/usr/bin/env bash

TIMEOUT=10000
LAYER_ID="sea_level.sla"
VARIABLE_ID="sla"
VERSION="0.5.1"
ZOOM_LEVELS="0-3"
MIN="-0.5"
MAX="0.5"
MACHINE_TYPE="N1_HIGHCPU_8"

if [ ! -f ./package.json ]; then
    echo "You have to be in the root folder of the project to run this script!"
    exit 1
fi

gcloud builds submit --config ./ci/cloudbuild-tiles.yaml \
  --machine-type=$MACHINE_TYPE \
  --timeout=$TIMEOUT \
  --substitutions _LAYER_ID=$LAYER_ID,_VARIABLE_ID=$VARIABLE_ID,_ZOOM_LEVELS=$ZOOM_LEVELS,_VERSION=$VERSION,_MIN=$MIN,_MAX=$MAX \
  .
