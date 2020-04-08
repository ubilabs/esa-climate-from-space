#!/usr/bin/env bash

timeout=2000

LAYER_ID="fire.burned_area"
VARIABLE_ID="burned_area"
VERSION="test"

if [ ! -f ./package.json ]; then
    echo "You have to be in the root folder of the project to run this script!"
    exit 1
fi

gcloud builds submit --config ./ci/cloudbuild-tiles.yaml --timeout=$timeout --substitutions _LAYER_ID=$LAYER_ID,_VARIABLE_ID=$VARIABLE_ID,_DATASET_ID=$DATASET_ID,_TIME_RANGE=$TIME_RANGE,_TILE_SIZE=$TILE_SIZE,_VERSION=$VERSION,_RESAMPLE_TIME=$RESAMPLE_TIME .
