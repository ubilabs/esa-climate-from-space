#!/usr/bin/env bash

BASE_URL="ftp://anon-ftp.ceda.ac.uk/neodc/esacci/sst/data/CDR_v2/Analysis/L4/v2.1/"
START_DATE=1981-09-01
OUTPUT_FOLDER=./download/sst

mkdir -p $OUTPUT_FOLDER

for i in {0..423}
do
  NEXT_DATE=$(date +%Y/%m/%d -d "$START_DATE + $i month")
  NEXT_DATE_SPACE=$(date +%Y%m%d -d "$START_DATE + $i month")
  FILENAME=$OUTPUT_FOLDER/$(date +%Y%m%d -d "$START_DATE + $i month").nc
  FTP_URL=$BASE_URL$NEXT_DATE/$NEXT_DATE_SPACE"120000-ESACCI-L4_GHRSST-SSTdepth-OSTIA-GLOB_CDR2.1-v02.0-fv01.0.nc"
  echo $FTP_URL

  curl --silent $FTP_URL > $FILENAME

  python ./data/drop-unused-vars.py --file $FILENAME --variable analysed_sst
done
