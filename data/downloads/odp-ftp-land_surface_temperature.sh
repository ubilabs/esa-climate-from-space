#!/usr/bin/env bash

BASE_URL="ftp://anon-ftp.ceda.ac.uk/neodc/esacci/land_surface_temperature/data/SSMI_SSMIS/L3C/v2.33//monthly/"
START_DATE=1996-01-01
OUTPUT_FOLDER=./download/lst

mkdir -p $OUTPUT_FOLDER

for i in {0..155}
do
  NEXT_DATE=$(date +%Y%m -d "$START_DATE + $i month")
  NEXT_YEAR=$(date +%Y -d "$START_DATE + $i month")
  FILENAME=$OUTPUT_FOLDER/$(date +%Y%m%d -d "$START_DATE + $i month").nc
  FTP_URL=$BASE_URL$NEXT_YEAR/"ESACCI-LST-L3C-LST-SSMI13-0.25deg_1MONTHLY_ASC-"$NEXT_DATE"000000-fv2.33.nc"
  echo $FTP_URL

  curl --silent $FTP_URL > $FILENAME
done

START_DATE=2009-01-01
for i in {0..143}
do
  NEXT_DATE=$(date +%Y%m -d "$START_DATE + $i month")
  NEXT_YEAR=$(date +%Y -d "$START_DATE + $i month")
  FILENAME=$OUTPUT_FOLDER/$(date +%Y%m%d -d "$START_DATE + $i month").nc
  FTP_URL=$BASE_URL$NEXT_YEAR/"ESACCI-LST-L3C-LST-SSMI17-0.25deg_1MONTHLY_ASC-"$NEXT_DATE"000000-fv2.33.nc"
  echo $FTP_URL

  curl --silent $FTP_URL > $FILENAME
done

