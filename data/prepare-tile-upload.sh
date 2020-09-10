#!/usr/bin/env bash

variable=$1
layer=$2

mkdir -p /data/upload/$layer/tiles

# delete unwanted gdal .kml files
find /data/images/$variable -name '*.kml' -delete
# delete unwanted gdal .aux.xml files
find /data/images/$variable -name '*.aux.xml' -delete
# delete unwanted xcube metadata files
find /data/images/$variable -name '*.json' -delete
# move tiles - source directory structure: /data/images/{variable}/{timestep}/tiles/{zoom}/{x}/{y}
cp -r /data/images/$variable/* /data/upload/$layer/tiles/
# copy layer metadata
cp metadata.json /data/upload/$layer/metadata.json
# copy layer icon
cp /workspace/assets/layer-icons/$layer.png /data/upload/$layer/icon.png
# copy legend image
cp /workspace/assets/legend-images/$variable.png /data/upload/$layer/legend.png

cd /data/upload && zip -r -q ./$layer/package.zip ./*

