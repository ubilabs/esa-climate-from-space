#!/bin/bash

folder=$1

mkdir -p upload/tiles
mkdir upload/full

rm tmp/tiles/$folder/metadata.json
mv tmp/tiles/$folder/* upload/tiles/
mv tmp/new-metadata.json upload/metadata.json
mmv "tmp/full/$folder/*/0/0/0.png" "upload/full/#1.png"

cd upload && zip -r ./package.zip ./*

ls -la .
