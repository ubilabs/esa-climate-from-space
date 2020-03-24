#!/bin/bash
BASE_URL="ftp://anon-ftp.ceda.ac.uk/neodc/esacci/sst/data/CDR_v2/Analysis/L4/v2.1/"
START_DATE=2010-01-01

for i in {0..30}
do
   NEXT_DATE=$(date +%Y/%m/%d -d "$START_DATE + $i day")
   NEXT_DATE_SPACE=$(date +%Y%m%d -d "$START_DATE + $i day")
   FTP_URL=$BASE_URL$NEXT_DATE/$NEXT_DATE_SPACE"120000-ESACCI-L4_GHRSST-SSTdepth-OSTIA-GLOB_CDR2.1_anomaly-v02.0-fv01.0.nc"
   echo $FTP_URL
   curl --silent $FTP_URL > download/$i.nc
done

