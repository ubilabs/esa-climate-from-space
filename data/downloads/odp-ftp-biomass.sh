#!/usr/bin/env bash

DATA_VERSION="v3.0"
YEARS="2010 2017 2018"
OUTPUT_FODLER=./download/biomass

for YEAR in $YEARS
do
    FTP_URL="https://dap.ceda.ac.uk/neodc/esacci/biomass/data/agb/maps/$DATA_VERSION/netcdf/ESACCI-BIOMASS-L4-AGB-MERGED-100m-$YEAR-fv3.0.nc"
    FILENAME="$OUTPUT_FODLER/$YEAR".nc

    echo $FTP_URL

    curl $FTP_URL > $FILENAME

    # TODO - for now timestamps are overwritten by 'layers-config.json' entry
    # python ./data/add-time-coordinate.py --file $FILENAME --timestamp $(date +%Y-%m-%d -d "$YEAR-01-01")
done
