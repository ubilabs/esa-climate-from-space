#!/bin/bash

# sync properties in layers config file with live meta data
# Usage: ./scripts/update-metadata.sh <layerId (optional)>


version=0.6.1
workingDir="./download"
layersConfigFile="../data/layers-config.json"
layersConfig=$(cat $layersConfigFile)
#keys=$(jq -r 'keys[]' <<< "$layersConfig" | head -n 1)

# take optional layer ID from command line argument
layerID=$1 

# check if layer ID is set
if [ -z $layerID ]
then
    keys=$(jq -r 'keys[]' <<< "$layersConfig")
else
    keys=$layerID
fi

# for all key of the layer config
for datasetId in ${keys}
do
    echo $datasetId 

    # download metadata file
    path=gs://esa-cfs-tiles/$version/$datasetId/metadata.json
    metadataFileName=$datasetId-metadata.json
    gsutil cp $path $workingDir/$metadataFileName

    # iterate over config for dataset
    props=$(jq -r ".\"$datasetId\" | keys[]"  <<< "$layersConfig")
    for prop in ${props}
    do
        # extract new vlaue from layer config
        value=$(jq ".\"$datasetId\".\"$prop\""  <<< "$layersConfig")
        
        replacement=".\"$prop\" = $value"

        # overwrite property in corresponding metadata file
        # upload metedata file
        jq "$replacement" $workingDir/$metadataFileName > $workingDir/tmp-$metadataFileName

        # replace original file with output, overwriting oriignal file does not seem to work
        mv $workingDir/tmp-$metadataFileName $workingDir/$metadataFileName
    done
    # set cache header
    gsutil -q cp $workingDir/$metadataFileName $path
    gsutil -q setmeta -r -h "cache-control: no-cache" $path

    # delete files
    rm $workingDir/$metadataFileName
done
rm $workingDir