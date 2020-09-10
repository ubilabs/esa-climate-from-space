#!/usr/bin/env bash

BASE_URL_SH="ftp://anon-ftp.ceda.ac.uk/neodc/esacci/sea_ice/data/sea_ice_concentration/L4/amsr/25km/v2.1/SH"
BASE_URL_NH="ftp://anon-ftp.ceda.ac.uk/neodc/esacci/sea_ice/data/sea_ice_concentration/L4/amsr/25km/v2.1/NH"
START_DATE1=2002-06-01
START_DATE2=2002-06-16
OUTPUT_FODLER=./download/sea-ice

mkdir -p $OUTPUT_FODLER/NH
mkdir -p $OUTPUT_FODLER/SH

for i in {0..179}
do
  NEXT_YEAR=$(date +%Y/%m -d "$START_DATE1 + $i month")
  NEXT_MONTH1=$(date +%Y%m%d -d "$START_DATE1 + $i month")
  FILENAME_SH1=$OUTPUT_FODLER/SH/$NEXT_MONTH1.nc
  FILENAME_NH1=$OUTPUT_FODLER/NH/$NEXT_MONTH1.nc
  FTP_URL_SH1=$BASE_URL_SH/$NEXT_YEAR/ESACCI-SEAICE-L4-SICONC-AMSR_25.0kmEASE2-SH-$NEXT_MONTH1-fv2.1.nc
  FTP_URL_NH1=$BASE_URL_NH/$NEXT_YEAR/ESACCI-SEAICE-L4-SICONC-AMSR_25.0kmEASE2-NH-$NEXT_MONTH1-fv2.1.nc
  echo $FTP_URL_SH1
  curl --silent $FTP_URL_SH1 > $FILENAME_SH1
  echo $FTP_URL_NH1
  curl --silent $FTP_URL_NH1 > $FILENAME_NH1

  NEXT_MONTH2=$(date +%Y%m%d -d "$START_DATE2 + $i month")
  FILENAME_SH2=$OUTPUT_FODLER/SH/$NEXT_MONTH2.nc
  FILENAME_NH2=$OUTPUT_FODLER/NH/$NEXT_MONTH2.nc
  FTP_URL_SH2=$BASE_URL_SH/$NEXT_YEAR/ESACCI-SEAICE-L4-SICONC-AMSR_25.0kmEASE2-SH-$NEXT_MONTH2-fv2.1.nc
  FTP_URL_NH2=$BASE_URL_NH/$NEXT_YEAR/ESACCI-SEAICE-L4-SICONC-AMSR_25.0kmEASE2-NH-$NEXT_MONTH2-fv2.1.nc
  echo $FTP_URL_SH2
  curl --silent $FTP_URL_SH2 > $FILENAME_SH2
  echo $FTP_URL_NH2
  curl --silent $FTP_URL_NH2 > $FILENAME_NH2
done
