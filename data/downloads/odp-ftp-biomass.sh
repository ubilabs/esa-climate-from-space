#!/usr/bin/env bash

DATA_VERSION="v2.0"
YEARS="2010 2017 2018"
OUTPUT_FODLER=./download


for YEAR in $YEARS
do
    FTP_URL="ftp://anon-ftp.ceda.ac.uk/neodc/esacci/biomass/data/agb/maps/$DATA_VERSION/netcdf/$YEAR/ESACCI-BIOMASS-L4-AGB-MERGED-100m-$YEAR-f$DATA_VERSION.nc"
    FILENAME="$OUTPUT_FODLER/$YEAR".nc

    echo $FTP_URL

    curl --silent $FTP_URL > $FILENAME

    # TODO - for now timestamps are overwritten by 'layers-config.json' enrty
    # python ./data/add-time-coordinate.py --file $FILENAME --timestamp $(date +%Y-%m-%d -d "$YEAR-01-01")
done
