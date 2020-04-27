#!/usr/bin/env bash

BASE_URL_SH="ftp://anon-ftp.ceda.ac.uk/neodc/esacci/sea_ice/data/sea_ice_concentration/L4/amsr/25km/v2.1/SH"
BASE_URL_NH="ftp://anon-ftp.ceda.ac.uk/neodc/esacci/sea_ice/data/sea_ice_concentration/L4/amsr/25km/v2.1/NH"
START_DATE=2002-06-01
OUTPUT_FODLER=./download

mkdir $OUTPUT_FODLER/NH
mkdir $OUTPUT_FODLER/SH

for i in {0..5}
do
  NEXT_YEAR=$(date +%Y/%m -d "$START_DATE + $i month")
  NEXT_MONTH=$(date +%Y%m%d -d "$START_DATE + $i month")
  FILENAME_SH=$OUTPUT_FODLER/SH/$(date +%Y%m%d -d "$START_DATE + $i month").nc
  FILENAME_NH=$OUTPUT_FODLER/NH/$(date +%Y%m%d -d "$START_DATE + $i month").nc
  FTP_URL_SH=$BASE_URL_SH/$NEXT_YEAR/ESACCI-SEAICE-L4-SICONC-AMSR_25.0kmEASE2-SH-$NEXT_MONTH-fv2.1.nc
  FTP_URL_NH=$BASE_URL_NH/$NEXT_YEAR/ESACCI-SEAICE-L4-SICONC-AMSR_25.0kmEASE2-NH-$NEXT_MONTH-fv2.1.nc
  echo $FTP_URL_SH
  curl --silent $FTP_URL_SH > $FILENAME_SH
  # python ./data/drop-unused-vars.py --file $FILENAME_SH --variable ice_conc
  echo $FTP_URL_NH
  curl --silent $FTP_URL_NH > $FILENAME_NH
  # python ./data/drop-unused-vars.py --file $FILENAME_NH --variable ice_conc
done
