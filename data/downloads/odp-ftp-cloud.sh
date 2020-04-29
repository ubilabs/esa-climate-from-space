#!/usr/bin/env bash

BASE_URL="ftp://anon-ftp.ceda.ac.uk/neodc/esacci/ocean_colour/data/v4.0-release/geographic/netcdf/chlor_a/monthly/v4.0/"
START_DATE=1997-09-01
OUTPUT_FODLER=./download

for i in {0..10}
do
  NEXT_YEAR=$(date +%Y -d "$START_DATE + $i month")
  NEXT_MONTH=$(date +%Y%m -d "$START_DATE + $i month")
  FILENAME=$OUTPUT_FODLER/$(date +%Y%m%d -d "$START_DATE + $i month").nc
  FTP_URL=$BASE_URL$NEXT_YEAR/ESACCI-OC-L3S-CHLOR_A-MERGED-1M_MONTHLY_4km_GEO_PML_OCx-$NEXT_MONTH-fv4.0.nc
  echo $FTP_URL

  curl --silent $FTP_URL > $FILENAME

  python ./data/drop-unused-vars.py --file $FILENAME --variable chlor_a
done
