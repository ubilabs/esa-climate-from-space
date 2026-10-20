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
    gcloud storage cp --verbosity=error --no-user-output-enabled $path $metadataFileName

    # merge layer config into metdata file
    jq -s ".[0] + .[1].\"$datasetId\"" $metadataFileName $layersConfigFile | gcloud storage cp --verbosity=error --no-user-output-enabled - $path

    # set cachhing headers foir remote file
    gcloud storage objects update --verbosity=error --no-user-output-enabled --cache-control=no-cache $path

    # delete files
    rm $metadataFileName
done
