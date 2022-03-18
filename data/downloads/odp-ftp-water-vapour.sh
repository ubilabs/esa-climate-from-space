#!/usr/bin/env bash

BASE_URL="ftp://anon-ftp.ceda.ac.uk//neodc/esacci/water_vapour/data/TCWV-land/L3/v3.2/0.05deg/monthly/"
START_DATE=2002-07-01
OUTPUT_FOLDER=./download/water_vapour

mkdir -p $OUTPUT_FOLDER

for i in {0..101}
do
  NEXT_DATE=$(date +%Y%m -d "$START_DATE + $i month")
  NEXT_YEAR=$(date +%Y -d "$START_DATE + $i month")
  FILENAME=$OUTPUT_FOLDER/$(date +%Y%m%d -d "$START_DATE + $i month").nc
  FTP_URL=$BASE_URL$NEXT_YEAR/"ESACCI-WATERVAPOUR-L3C-TCWV-meris-005deg-"$NEXT_DATE"-fv3.2.nc"
  echo $FTP_URL

  curl $FTP_URL > $FILENAME
done

START_DATE=2011-01-01
for i in {0..14}
do
  NEXT_DATE=$(date +%Y%m -d "$START_DATE + $i month")
  NEXT_YEAR=$(date +%Y -d "$START_DATE + $i month")
  FILENAME=$OUTPUT_FOLDER/$(date +%Y%m%d -d "$START_DATE + $i month").nc
  FTP_URL=$BASE_URL$NEXT_YEAR/"ESACCI-WATERVAPOUR-L3C-TCWV-meris_modis_terra-005deg-"$NEXT_DATE"-fv3.2.nc"
  echo $FTP_URL

  curl $FTP_URL > $FILENAME
done


START_DATE=2012-04-01
for i in {0..47}
do
  NEXT_DATE=$(date +%Y%m -d "$START_DATE + $i month")
  NEXT_YEAR=$(date +%Y -d "$START_DATE + $i month")
  FILENAME=$OUTPUT_FOLDER/$(date +%Y%m%d -d "$START_DATE + $i month").nc
  FTP_URL=$BASE_URL$NEXT_YEAR/"ESACCI-WATERVAPOUR-L3C-TCWV-modis_terra-005deg-"$NEXT_DATE"-fv3.2.nc"
  echo $FTP_URL

  curl $FTP_URL > $FILENAME
done

START_DATE=2016-04-01
for i in {0..8}
do
  NEXT_DATE=$(date +%Y%m -d "$START_DATE + $i month")
  NEXT_YEAR=$(date +%Y -d "$START_DATE + $i month")
  FILENAME=$OUTPUT_FOLDER/$(date +%Y%m%d -d "$START_DATE + $i month").nc
  FTP_URL=$BASE_URL$NEXT_YEAR/"ESACCI-WATERVAPOUR-L3C-TCWV-olci_modis_terra-005deg-"$NEXT_DATE"-fv3.2.nc"
  echo $FTP_URL

  curl $FTP_URL > $FILENAME
done



START_DATE=2017-01-01
for i in {0..11}
do
  NEXT_DATE=$(date +%Y%m -d "$START_DATE + $i month")
  NEXT_YEAR=$(date +%Y -d "$START_DATE + $i month")
  FILENAME=$OUTPUT_FOLDER/$(date +%Y%m%d -d "$START_DATE + $i month").nc
  FTP_URL=$BASE_URL$NEXT_YEAR/"ESACCI-WATERVAPOUR-L3C-TCWV-olci-005deg-"$NEXT_DATE"-fv3.2.nc"
  echo $FTP_URL

  curl $FTP_URL > $FILENAME
done

