#!/usr/bin/env bash

DATA_VERSION="v4.0"
YEARS="2010 2017 2018 2019 2020"
OUTPUT_FODLER=./download/biomass

for YEAR in $YEARS
do
    URL="https://dap.ceda.ac.uk/neodc/esacci/biomass/data/agb/maps/$DATA_VERSION/netcdf/ESACCI-BIOMASS-L4-AGB-MERGED-100m-$YEAR-f$DATA_VERSION.nc?download=1"
    FILENAME="$OUTPUT_FODLER/$YEAR"0101.nc

    echo $URL
    wget -O $FILENAME $URL

    # TODO - for now timestamps are overwritten by 'layers-config.json' entry
    # python ./data/add-time-coordinate.py --file $FILENAME --timestamp $(date +%Y-%m-%d -d "$YEAR-01-01")
done
