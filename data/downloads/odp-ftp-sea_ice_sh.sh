#!/usr/bin/env bash

BASE_URL="ftp://anon-ftp.ceda.ac.uk/neodc/esacci/sea_ice/data/sea_ice_concentration/L4/amsr/25km/v2.1/SH"
START_DATE=2002-06-01
OUTPUT_FODLER=./download

for i in {0..5}
do
  NEXT_YEAR=$(date +%Y/%m -d "$START_DATE + $i month")
  NEXT_MONTH=$(date +%Y%m%d -d "$START_DATE + $i month")
  FILENAME=$OUTPUT_FODLER/$(date +%Y%m%d -d "$START_DATE + $i month").nc
  FTP_URL=$BASE_URL/$NEXT_YEAR/ESACCI-SEAICE-L4-SICONC-AMSR_25.0kmEASE2-SH-$NEXT_MONTH-fv2.1.nc
  echo $FTP_URL

  curl --silent $FTP_URL > $FILENAME

  python ./data/drop-unused-vars.py --file $FILENAME --variable ice_conc
done
