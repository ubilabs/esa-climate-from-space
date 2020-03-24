#!/bin/bash

timeout=2000

LAYER_ID="fire.burned_area"
DATASET_ID="esacci.FIRE.mon.L4.BA.MODIS.Terra.MODIS_TERRA.v5-1.r1"
VARIABLE_ID="burned_area"
TIME_RANGE="2010-01-01.2017-01-01"
RESAMPLE_TIME="1m"
TILE_SIZE=256
VERSION="resample"

if [ ! -f ./package.json ]; then
    echo "You have to be in the root folder of the project to run this script!"
    exit 1
fi

gcloud builds submit --config ./ci/cloudbuild-tiles.yaml --timeout=$timeout --substitutions _LAYER_ID=$LAYER_ID,_VARIABLE_ID=$VARIABLE_ID,_DATASET_ID=$DATASET_ID,_TIME_RANGE=$TIME_RANGE,_TILE_SIZE=$TILE_SIZE,_VERSION=$VERSION,_RESAMPLE_TIME=$RESAMPLE_TIME .
