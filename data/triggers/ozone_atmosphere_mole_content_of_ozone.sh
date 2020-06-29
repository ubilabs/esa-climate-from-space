#!/usr/bin/env bash

TIMEOUT=8000
LAYER_ID="ozone.atmosphere_mole_content_of_ozone"
VARIABLE_ID="atmosphere_mole_content_of_ozone"
VERSION="0.5.1"
ZOOM_LEVELS="0-3"
MIN="100"
MAX="500"
MACHINE_TYPE="N1_HIGHCPU_8"

if [ ! -f ./package.json ]; then
    echo "You have to be in the root folder of the project to run this script!"
    exit 1
fi

# --machine-type=$MACHINE_TYPE \
gcloud builds submit --config ./ci/cloudbuild-tiles.yaml \
  --timeout=$TIMEOUT \
  --substitutions _LAYER_ID=$LAYER_ID,_VARIABLE_ID=$VARIABLE_ID,_ZOOM_LEVELS=$ZOOM_LEVELS,_VERSION=$VERSION,_MIN=$MIN,_MAX=$MAX \
  .
