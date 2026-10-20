#!/usr/bin/env bash

# Builds the ozon profile offline bundle because this one is not created
# automatically in the data layer pipeline

ID=ozone.ozone_profile
mkdir -p ./download/$ID
rm -rf ./download/$ID/*

VERSION=0.8.2

# Download files
gcloud storage cp gs://esa-cfs-tiles/$VERSION/$ID/metadata.json ./download/$ID/
gcloud storage cp --recursive gs://esa-cfs-tiles/$VERSION/$ID/tiles ./download/$ID/
cp ./assets/layer-icons/$ID.png ./download/$ID/icon.png
cp ./assets/legend-images/ozone_profile.png ./download/$ID/legend.png

# zip
cd download/
zip -r ./$ID/package.zip ./$ID

# upload new package
gcloud storage cp ./$ID/package.zip gs://esa-cfs-tiles/$VERSION/$ID/package.zip
