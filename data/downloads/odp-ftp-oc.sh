#!/usr/bin/env bash

VERSION=6.0
START_DATE=1997-09-01
END_DATE=2022-12-01

BASE_URL="https://dap.ceda.ac.uk/neodc/esacci/ocean_colour/data/v$VERSION-release/geographic/netcdf/chlor_a/monthly/v$VERSION/"
OUTPUT_FOLDER=./download/oc

mkdir -p $OUTPUT_FOLDER

current_date=$START_DATE
while [[ "$current_date" < $(date -I -d "$END_DATE + 1 month") ]]; do
  NEXT_YEAR=$(date +%Y -d "$current_date")
  NEXT_MONTH=$(date +%Y%m -d "$current_date")
  FILENAME=$OUTPUT_FOLDER/$(date +%Y%m%d -d "$current_date").nc
  FTP_URL=$BASE_URL$NEXT_YEAR/ESACCI-OC-L3S-CHLOR_A-MERGED-1M_MONTHLY_4km_GEO_PML_OCx-$NEXT_MONTH-fv$VERSION.nc?download=1

  echo $FTP_URL
  curl -L $FTP_URL > $FILENAME

  python3 ./log-values.py --file $FILENAME --variable chlor_a
  python3 ./drop-unused-vars.py --file $FILENAME --variable chlor_a

  current_date=$(date -I -d "$current_date + 1 month")
done