#!/usr/bin/env bash

URL="ftp://anon-ftp.ceda.ac.uk/neodc/esacci/biomass/data/agb/maps/2017/v1.0/netcdf/ESACCI-BIOMASS-L4-AGB-MERGED-100m-2017-fv1.0.nc"
START_DATE=2017-01-01
OUTPUT_FODLER=./download

FILENAME=$OUTPUT_FODLER/$(date +%Y%m%d -d "$START_DATE + $i month").nc
echo $FTP_URL

curl --silent $FTP_URL > $FILENAME

python ./data/drop-unused-vars.py --file $FILENAME --variable AOD550_mean
python ./data/add-time-coordinate.py --file $FILENAME --timestamp $NEXT_DATE
