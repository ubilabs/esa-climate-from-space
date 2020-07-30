#!/usr/bin/env bash

BASE_URL="ftp://anon-ftp.ceda.ac.uk/neodc/esacci/ice_sheets_greenland/data/greenland_surface_elevation_change/v1.2/"

OUTPUT_FODLER=./download/greenland

mkdir -p $OUTPUT_FODLER

curl --silent $BASE_URL"XO_1992_1996.nc" > $OUTPUT_FODLER/1996-01-01.nc
curl --silent $BASE_URL"XO_1993_1997.nc" > $OUTPUT_FODLER/1997-01-01.nc
curl --silent $BASE_URL"XO_1994_1998.nc" > $OUTPUT_FODLER/1998-01-01.nc
curl --silent $BASE_URL"XO_1995_1999.nc" > $OUTPUT_FODLER/1999-01-01.nc
curl --silent $BASE_URL"RT_XO_1996_2000.nc" > $OUTPUT_FODLER/2000-01-01.nc
curl --silent $BASE_URL"RT_XO_1997_2001.nc" > $OUTPUT_FODLER/2001-01-01.nc
curl --silent $BASE_URL"RT_XO_1998_2002.nc" > $OUTPUT_FODLER/2002-01-01.nc
curl --silent $BASE_URL"AT_XO_1999_2003.nc" > $OUTPUT_FODLER/2003-01-01.nc
curl --silent $BASE_URL"AT_XO_2000_2004.nc" > $OUTPUT_FODLER/2004-01-01.nc
curl --silent $BASE_URL"AT_XO_2001_2005.nc" > $OUTPUT_FODLER/2005-01-01.nc
curl --silent $BASE_URL"AT_XO_2002_2006.nc" > $OUTPUT_FODLER/2006-01-01.nc
curl --silent $BASE_URL"RT_XO_2003_2007.nc" > $OUTPUT_FODLER/2007-01-01.nc
curl --silent $BASE_URL"RT_XO_2004_2008.nc" > $OUTPUT_FODLER/2008-01-01.nc
curl --silent $BASE_URL"RT_XO_2005_2009.nc" > $OUTPUT_FODLER/2009-01-01.nc
curl --silent $BASE_URL"RT_XO_2006_2010.nc" > $OUTPUT_FODLER/2010-01-01.nc
curl --silent $BASE_URL"AT_XO_2007_2011.nc" > $OUTPUT_FODLER/2011-01-01.nc

python ./data/add-time-coordinate.py --file $OUTPUT_FODLER/1996-01-01.nc --timestamp 1996-01-01
python ./data/add-time-coordinate.py --file $OUTPUT_FODLER/1997-01-01.nc --timestamp 1997-01-01
python ./data/add-time-coordinate.py --file $OUTPUT_FODLER/1998-01-01.nc --timestamp 1998-01-01
python ./data/add-time-coordinate.py --file $OUTPUT_FODLER/1999-01-01.nc --timestamp 1999-01-01
python ./data/add-time-coordinate.py --file $OUTPUT_FODLER/2000-01-01.nc --timestamp 2000-01-01
python ./data/add-time-coordinate.py --file $OUTPUT_FODLER/2001-01-01.nc --timestamp 2001-01-01
python ./data/add-time-coordinate.py --file $OUTPUT_FODLER/2002-01-01.nc --timestamp 2002-01-01
python ./data/add-time-coordinate.py --file $OUTPUT_FODLER/2003-01-01.nc --timestamp 2003-01-01
python ./data/add-time-coordinate.py --file $OUTPUT_FODLER/2004-01-01.nc --timestamp 2004-01-01
python ./data/add-time-coordinate.py --file $OUTPUT_FODLER/2005-01-01.nc --timestamp 2005-01-01
python ./data/add-time-coordinate.py --file $OUTPUT_FODLER/2006-01-01.nc --timestamp 2006-01-01
python ./data/add-time-coordinate.py --file $OUTPUT_FODLER/2007-01-01.nc --timestamp 2007-01-01
python ./data/add-time-coordinate.py --file $OUTPUT_FODLER/2008-01-01.nc --timestamp 2008-01-01
python ./data/add-time-coordinate.py --file $OUTPUT_FODLER/2009-01-01.nc --timestamp 2009-01-01
python ./data/add-time-coordinate.py --file $OUTPUT_FODLER/2010-01-01.nc --timestamp 2010-01-01
python ./data/add-time-coordinate.py --file $OUTPUT_FODLER/2011-01-01.nc --timestamp 2011-01-01
