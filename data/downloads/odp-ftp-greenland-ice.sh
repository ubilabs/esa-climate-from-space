#!/usr/bin/env bash

BASE_URL="ftp://anon-ftp.ceda.ac.uk/neodc/esacci/ice_sheets_greenland/data/greenland_surface_elevation_change/v1.2/RT_XO_"

OUTPUT_FODLER=./download

curl --silent $BASE_URL"1996_2000.nc" > $OUTPUT_FODLER/2000-01-01.nc
curl --silent $BASE_URL"1997_2001.nc" > $OUTPUT_FODLER/2001-01-01.nc
curl --silent $BASE_URL"1998_2002.nc" > $OUTPUT_FODLER/2002-01-01.nc
curl --silent $BASE_URL"2003_2007.nc" > $OUTPUT_FODLER/2007-01-01.nc
curl --silent $BASE_URL"2004_2008.nc" > $OUTPUT_FODLER/2008-01-01.nc
curl --silent $BASE_URL"2005_2009.nc" > $OUTPUT_FODLER/2009-01-01.nc
curl --silent $BASE_URL"2006_2010.nc" > $OUTPUT_FODLER/2010-01-01.nc

python ./data/add-time-coordinate.py --file $OUTPUT_FODLER/2000-01-01.nc --timestamp 2000-01-01
python ./data/add-time-coordinate.py --file $OUTPUT_FODLER/2001-01-01.nc --timestamp 2001-01-01
python ./data/add-time-coordinate.py --file $OUTPUT_FODLER/2002-01-01.nc --timestamp 2002-01-01
python ./data/add-time-coordinate.py --file $OUTPUT_FODLER/2007-01-01.nc --timestamp 2007-01-01
python ./data/add-time-coordinate.py --file $OUTPUT_FODLER/2008-01-01.nc --timestamp 2008-01-01
python ./data/add-time-coordinate.py --file $OUTPUT_FODLER/2009-01-01.nc --timestamp 2009-01-01
python ./data/add-time-coordinate.py --file $OUTPUT_FODLER/2010-01-01.nc --timestamp 2010-01-01
