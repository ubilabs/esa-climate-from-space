#!/usr/bin/env bash

TIMEOUT=8000
LAYER_ID="biomass.agb"
VARIABLE_ID="agb"
VERSION="0.5.1"
ZOOM_LEVELS="0-5"
MIN_LON="-180"
MAX_LON="180"
MIN_LAT="-60"
MAX_LAT="80"
MIN="0"
MAX="100"
MACHINE_TYPE="N1_HIGHCPU_32"

if [ ! -f ./package.json ]; then
    echo "You have to be in the root folder of the project to run this script!"
    exit 1
fi

# Note! If process takes too long use "-ts 81000 x 31500 \" in gdalwarp command to
# output only a 1/5th-resolution image

gcloud builds submit --config ./ci/cloudbuild-tiles-reproject.yaml \
  --machine-type=$MACHINE_TYPE \
  --timeout=$TIMEOUT \
  --substitutions _LAYER_ID=$LAYER_ID,_VARIABLE_ID=$VARIABLE_ID,_ZOOM_LEVELS=$ZOOM_LEVELS,_VERSION=$VERSION,_MIN=$MIN,_MAX=$MAX,_MIN_LON=$MIN_LON,_MAX_LON=$MAX_LON,_MIN_LAT=$MIN_LAT,_MAX_LAT=$MAX_LAT \
  .
