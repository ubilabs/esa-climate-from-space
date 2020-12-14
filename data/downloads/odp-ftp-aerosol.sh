#!/usr/bin/env bash

VERSION="4.3"
BASE_URL="ftp://anon-ftp.ceda.ac.uk/neodc/esacci/aerosol/data/AATSR_SU/L3/v$VERSION/MONTHLY/"
START_DATE=2012-01-01
OUTPUT_FODLER=./download/aerosol

mkdir -p $OUTPUT_FODLER

for i in {0..117}
do
  NEXT_YEAR=$(date +%Y -d "$START_DATE + $i month")
  NEXT_MONTH=$(date +%Y%m -d "$START_DATE + $i month")
  NEXT_DATE=$(date +%Y-%m-%d -d "$START_DATE + $i month")
  FILENAME=$OUTPUT_FODLER/$(date +%Y%m%d -d "$START_DATE + $i month").nc
  FTP_URL=$BASE_URL$NEXT_YEAR/$NEXT_MONTH-ESACCI-L3C_AEROSOL-AER_PRODUCTS-AATSR_ENVISAT-SU_MONTHLY-v$VERSION.nc
  echo $FTP_URL

  curl --silent $FTP_URL > $FILENAME

  python ./data/drop-unused-vars.py --file $FILENAME --variable AOD550_mean
  python ./data/add-time-coordinate.py --file $FILENAME --timestamp $NEXT_DATE
done
