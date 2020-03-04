#!/bin/bash

variable=$1
layer=$2

mkdir -p upload/$layer/tiles
mkdir upload/$layer/full

rm tmp/tiles/$variable/metadata.json
mv tmp/tiles/$variable/* upload/$layer/tiles/
mv tmp/new-metadata.json upload/$layer/metadata.json
mmv "tmp/full/$variable/*/0/0/0.png" "upload/$layer/full/#1.png"

cd upload && zip -r ./$layer/package.zip ./*

# debug
ls -la .
ls -la $layer
