#!/usr/bin/env bash

BASE_URL="ftp://anon-ftp.ceda.ac.uk/neodc/esacci/sea_state/data/v1.1_release/l4/v1.1"
START_DATE=1993-01-01
OUTPUT_FODLER=./download

for i in {0..10}
do
  NEXT_YEAR=$(date +%Y -d "$START_DATE + $i month")
  NEXT_MONTH=$(date +%Y%m -d "$START_DATE + $i month")
  NEXT_DATE=$(date +%Y-%m-%d -d "$START_DATE + $i month")
  FILENAME=$OUTPUT_FODLER/$(date +%Y%m%d -d "$START_DATE + $i month").nc
  FTP_URL=$BASE_URL/$NEXT_YEAR/ESACCI-SEASTATE-L4-SWH-MULTI_1M-$NEXT_MONTH-fv01.nc
  echo $FTP_URL

  curl --silent $FTP_URL > $FILENAME

  python ./data/drop-unused-vars.py --file $FILENAME --variable swh_mean
  python ./data/mask-values.py --file $FILENAME --variable swh_mean --max 100
done
