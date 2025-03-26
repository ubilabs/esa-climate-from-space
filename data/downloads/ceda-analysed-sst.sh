#!/usr/bin/env bash

BASE_URL="https://data.ceda.ac.uk/neodc/eocis/data/global_and_regional/sea_surface_temperature/CDR_v3/Analysis/L4/v3.0.1/"
START_DATE=1980-01-01
OUTPUT_FOLDER=./download/sst

mkdir -p $OUTPUT_FOLDER

for i in {0..528}
do
  NEXT_DATE=$(date -j -v+"$i"m -f "%Y-%m-%d" "$START_DATE" "+%Y/%m/%d")
  NEXT_DATE_SPACE=$(date -j -v+"$i"m -f "%Y-%m-%d" "$START_DATE" "+%Y%m%d")

  FILENAME=$OUTPUT_FOLDER/$NEXT_DATE_SPACE.nc
  URL=$BASE_URL$NEXT_DATE/$NEXT_DATE_SPACE"120000-ESACCI-L4_GHRSST-SSTdepth-OSTIA-GLOB_CDR3.0-v02.0-fv01.0.nc"
  echo $URL

  curl --silent -L $URL > $FILENAME

  python ../../data/drop-unused-vars.py --file $FILENAME --variable analysed_sst
done
