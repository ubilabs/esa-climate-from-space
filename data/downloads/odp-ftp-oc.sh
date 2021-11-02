#!/usr/bin/env bash

VERSION=5.0
START_DATE=1997-09-01
END_DATE=2020-12-01

BASE_URL="ftp://anon-ftp.ceda.ac.uk/neodc/esacci/ocean_colour/data/v$VERSION-release/geographic/netcdf/chlor_a/monthly/v$VERSION/"
OUTPUT_FOLDER=./download/oc

# timestamped download folder to not overwrite prvious runs
OUTPUT_FOLDER=$OUTPUT_FOLDER-$(env TZ=Europe/Berlin date +%Y%m%d%H%M)
mkdir -p $OUTPUT_FOLDER

current_date=$START_DATE
while [[ "$current_date" < $(date -I -d "$END_DATE + 1 month") ]]; do 
  echo $current_date
  NEXT_YEAR=$(date +%Y -d "$current_date")
  NEXT_MONTH=$(date +%Y%m -d "$current_date")
  FILENAME=$OUTPUT_FOLDER/$(date +%Y%m%d -d "$current_date").nc
  FTP_URL=$BASE_URL$NEXT_YEAR/ESACCI-OC-L3S-CHLOR_A-MERGED-1M_MONTHLY_4km_GEO_PML_OCx-$NEXT_MONTH-fv$VERSION.nc

  echo $FTP_URL
  curl --silent $FTP_URL > $FILENAME

  python ./data/log-values.py --file $FILENAME --variable chlor_a
  python ./data/drop-unused-vars.py --file $FILENAME --variable chlor_a

  current_date=$(date -I -d "$current_date + 1 month")
done
