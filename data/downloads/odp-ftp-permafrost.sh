#!/usr/bin/env bash

#             ftp://anon-ftp.ceda.ac.uk/neodc/esacci/permafrost/data/permafrost_extent/L4/area4/pp/v03.0/ESACCI-PERMAFROST-L4-PFR-ERA5_MODISLST_BIASCORRECTED-AREA4_PP-1997-fv03.0.nc
BASE_URL_OLD="ftp://anon-ftp.ceda.ac.uk/neodc/esacci/permafrost/data/permafrost_extent/L4/area4/pp/v03.0/ESACCI-PERMAFROST-L4-PFR-ERA5_MODISLST_BIASCORRECTED-AREA4_PP"
#             ftp://anon-ftp.ceda.ac.uk/neodc/esacci/permafrost/data/permafrost_extent/L4/area4/pp/v03.0/ESACCI-PERMAFROST-L4-PFR-MODISLST_CRYOGRID-AREA4_PP-2003-fv03.0.nc
BASE_URL_NEW="ftp://anon-ftp.ceda.ac.uk/neodc/esacci/permafrost/data/permafrost_extent/L4/area4/pp/v03.0/ESACCI-PERMAFROST-L4-PFR-MODISLST_CRYOGRID-AREA4_PP"
START_DATE=1997-01-01
END_DATE=2019-12-01
OUTPUT_FODLER=./download/permafrost

mkdir -p $OUTPUT_FODLER

current_date=$START_DATE
while [[ "$current_date" < $(date -I -d "$END_DATE + 1 month") ]]; do 
  echo "$current_date"
  NEXT_YEAR=$(date +%Y -d "$current_date")

  FILENAME=$OUTPUT_FODLER/$NEXT_YEAR.nc

  if [[ $current_date -lt "2003-01-01" ]]
  then
    FTP_URL=$BASE_URL_OLD"-"$NEXT_YEAR"-fv03.0.nc"
  else
    FTP_URL=$BASE_URL_NEW"-"$NEXT_YEAR"-fv03.0.nc"
  fi

  echo $FTP_URL
  # echo $FILENAME
  # curl --silent $FTP_URL > $FILENAME


  
  # NEXT_YEAR=$(date +%Y -d "$START_DATE + $i year")
  # NEXT_DATE=$(date +%Y-%m-%d -d "$START_DATE + $i year")
  
  # FTP_URL=$BASE_URL"-"$NEXT_YEAR"-fv01.0.nc"
  # echo $FTP_URL

  # curl --silent $FTP_URL > $FILENAME

  python ./data/add-time-coordinate.py --file $FILENAME --timestamp $current_date
  current_date=$(date -I -d "$current_date + 1 year")
done
