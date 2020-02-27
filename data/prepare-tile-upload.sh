#!/bin/bash

folder=$1

mkdir -p upload/tiles
mkdir upload/full

mv tmp/tiles/$folder/metadata.json upload/
mv tmp/tiles/$folder/* upload/tiles/
mmv "tmp/full/$folder/*/0/0/0.png" "upload/full/#1.png"
# mv tmp/dataset.zip upload/

ls -la upload
