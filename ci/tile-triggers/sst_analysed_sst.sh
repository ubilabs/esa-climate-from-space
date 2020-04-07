#!/bin/bash

timeout=8000

LAYER_ID="sst.analysed_sst"
VARIABLE_ID="analysed_sst"
VERSION="test-resize"

if [ ! -f ./package.json ]; then
    echo "You have to be in the root folder of the project to run this script!"
    exit 1
fi

gcloud builds submit --config ./ci/cloudbuild-dataset.yaml --timeout=$timeout --substitutions _LAYER_ID=$LAYER_ID,_VARIABLE_ID=$VARIABLE_ID,_VERSION=test .
