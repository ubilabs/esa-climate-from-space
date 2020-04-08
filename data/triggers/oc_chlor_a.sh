#!/usr/bin/env bash

TIMEOUT=8000
LAYER_ID="oc.chlor_a"
VARIABLE_ID="chlor_a"
VERSION="test"
ZOOM_LEVELS="0-4"
MACHINE_TYPE="N1_HIGHCPU_8"
#MACHINE_TYPE=""

if [ ! -f ./package.json ]; then
    echo "You have to be in the root folder of the project to run this script!"
    exit 1
fi

gcloud builds submit --config ./ci/cloudbuild-tiles.yaml \
  --machine-type=$MACHINE_TYPE \
  --timeout=$TIMEOUT \
  --substitutions _LAYER_ID=$LAYER_ID,_VARIABLE_ID=$VARIABLE_ID,_ZOOM_LEVELS=$ZOOM_LEVELS,_VERSION=$VERSION \
  .
