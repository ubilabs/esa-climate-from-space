#!/usr/bin/env bash

BASE_URL="ftp://anon-ftp.ceda.ac.uk/neodc/esacci/sea_state/data/v1.1_release/l4/v1.1"
START_DATE=1991-08-01
OUTPUT_FODLER=./download/sea-state

mkdir -p $OUTPUT_FODLER

for i in {0..353}
do
  NEXT_YEAR=$(date +%Y -d "$START_DATE + $i month")
  NEXT_MONTH=$(date +%Y%m -d "$START_DATE + $i month")
  NEXT_DATE=$(date +%Y-%m-%d -d "$START_DATE + $i month")
  FILENAME=$OUTPUT_FODLER/$(date +%Y%m%d -d "$START_DATE + $i month").nc

  # Change base url to dataset v3 on date 2002-06-01
  if [ $i == 130 ]; then
    BASE_URL="ftp://anon-ftp.ceda.ac.uk/neodc/esacci/sea_state/data/v3_release/altimeter/l4/v3.0"
  fi

  FTP_URL=$BASE_URL/$NEXT_YEAR/ESACCI-SEASTATE-L4-SWH-MULTI_1M-$NEXT_MONTH-fv01.nc
  echo $FTP_URL

  curl --silent $FTP_URL > $FILENAME

  python /data/drop-unused-vars.py --file $FILENAME --variable swh_mean
  python /data/mask-values.py --file $FILENAME --variable swh_mean --max 100
done
