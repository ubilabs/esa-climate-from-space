#!/usr/bin/env bash

BASE_URL="ftp://anon-ftp.ceda.ac.uk/neodc/esacci/sea_level/data/L4/MSLA/v2.0/"
START_DATE=1994-01-15
OUTPUT_FODLER=./download/sea-level

mkdir -p $OUTPUT_FODLER

for i in {0..263}
do
  NEXT_YEAR=$(date +%Y -d "$START_DATE + $i month")
  NEXT_MONTH=$(date +%Y%m%d -d "$START_DATE + $i month")
  NEXT_DATE=$(date +%Y-%m-%d -d "$START_DATE + $i month")
  FILENAME=$OUTPUT_FODLER/$(date +%Y%m%d -d "$START_DATE + $i month").nc
  FTP_URL=$BASE_URL/$NEXT_YEAR/ESACCI-SEALEVEL-L4-MSLA-MERGED-$NEXT_MONTH"000000-fv02.nc"
  echo $FTP_URL

  curl --silent $FTP_URL > $FILENAME

  python ./data/drop-unused-vars.py --file $FILENAME --variable sla
  python ./data/add-time-coordinate.py --file $FILENAME --timestamp $NEXT_DATE
done
