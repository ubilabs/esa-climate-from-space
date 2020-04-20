#!/usr/bin/env bash

TIMEOUT=8000
LAYER_ID="land_cover.lccs_class"
VARIABLE_ID="lccs_class"
VERSION="test"
ZOOM_LEVELS="0-3"
MIN="auto"
MAX="auto"
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
