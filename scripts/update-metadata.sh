#!/bin/bash

# sync properties in layers config file with live meta data
# Usage: ./scripts/update-metadata.sh <layerId (optional)>


version=0.11.1
workingDir="./download"
layersConfigFile="./data/layers-config.json"

# take optional layer ID from command line argument
layerID=$1

# check if layer ID is set
if [ -z $layerID ]
then
    keys=$(jq -r 'keys[]' $layersConfigFile)
else
    keys=$layerID
fi

# for all key of the layer config
for datasetId in ${keys}
do
    echo $datasetId

    # download metadata file
    path=gs://esa-cfs-tiles/$version/$datasetId/metadata.json
    metadataFileName=$workingDir/$datasetId-metadata.json
    gsutil -q cp $path $metadataFileName

    # merge layer config into metdata file
    jq -s ".[0] + .[1].\"$datasetId\"" $metadataFileName $layersConfigFile | gsutil -q cp - $path

    # set cachhing headers foir remote file
    gsutil -q setmeta -r -h "cache-control: no-cache" $path

    # delete files
    rm $metadataFileName
done
