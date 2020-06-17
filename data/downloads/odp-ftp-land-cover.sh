#!/usr/bin/env bash

BASE_URL="ftp://anon-ftp.ceda.ac.uk/neodc/esacci/land_cover/data/land_cover_maps/v2.0.7/ESACCI-LC-L4-LCCS-Map-300m-P1Y-"
START_DATE=1992-01-01
OUTPUT_FODLER=./download/land-cover

mkdir -p $OUTPUT_FODLER

for i in {0..23}
do
  NEXT_YEAR=$(date +%Y -d "$START_DATE + $i year")
  NEXT_DATE=$(date +%Y-%m-%d -d "$START_DATE + $i year")
  FILENAME=$OUTPUT_FODLER/$(date +%Y%m%d -d "$START_DATE + $i year").nc
  FTP_URL=$BASE_URL$NEXT_YEAR-v2.0.7b.nc
  echo $FTP_URL

  curl --silent $FTP_URL > $FILENAME

  python ./data/drop-unused-vars.py --file $FILENAME --variable lccs_class
  python ./data/add-time-coordinate.py --file $FILENAME --timestamp $NEXT_DATE
done
