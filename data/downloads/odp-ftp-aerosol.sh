#!/usr/bin/env bash

BASE_URL="ftp://anon-ftp.ceda.ac.uk/neodc/esacci/aerosol/data/AATSR_SU/L3/v4.21/MONTHLY/"
START_DATE=2002-07-01
OUTPUT_FODLER=./download

for i in {0..24}
do
  NEXT_YEAR=$(date +%Y -d "$START_DATE + $i month")
  NEXT_MONTH=$(date +%Y%m -d "$START_DATE + $i month")
  NEXT_DATE=$(date +%Y-%m-%d -d "$START_DATE + $i month")
  FILENAME=$OUTPUT_FODLER/$(date +%Y%m%d -d "$START_DATE + $i month").nc
  FTP_URL=$BASE_URL$NEXT_YEAR/$NEXT_MONTH-ESACCI-L3C_AEROSOL-AER_PRODUCTS-AATSR_ENVISAT-SU_MONTHLY-v4.21.nc
  echo $FTP_URL

  curl --silent $FTP_URL > $FILENAME

  python ./data/drop-unused-vars.py --file $FILENAME --variable AOD550_mean
  python ./data/add-time-coordinate.py --file $FILENAME --timestamp $NEXT_DATE
done
