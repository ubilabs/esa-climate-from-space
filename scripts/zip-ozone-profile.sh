#!/usr/bin/env bash

# Builds the ozon profile offline bundle because this one is not created
# automatically in the data layer pipeline

ID=ozone.ozone_profile
mkdir -p ./download/$ID
rm -rf ./download/$ID/*

VERSION=0.8.2

# Download files
gsutil -m cp gs://esa-cfs-tiles/$VERSION/$ID/metadata.json ./download/$ID/
gsutil -m cp -r gs://esa-cfs-tiles/$VERSION/$ID/tiles ./download/$ID/

# zip
cd download/
zip -r ./$ID/package.zip ./$ID

# upload new package
gsutil -m cp -r ./$ID/package.zip gs://esa-cfs-tiles/$VERSION/$ID/package.zip
