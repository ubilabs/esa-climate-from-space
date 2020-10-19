#!/usr/bin/env bash

# For now the new ozone data is not available on the public ftp server.
# We use the data from https://drive.google.com/file/d/1Wqch3h0o07ccRqWSGd3FF_uGrF9fh32x/view

OUTPUT_FOLDER=./download/ozone2

mkdir -p $OUTPUT_FOLDER

FILES="./download/ozone/*.nc"
for file in $FILES
do
  DATE=`echo $file | grep -o --regexp='[0-9]\{6\}'`01
  TIMESTAMP=`date +%Y-%m-%d --date=$DATE`

  python ./data/replace-time-coordinate.py --file $file --timestamp $TIMESTAMP

  dir=`dirname $file`
  base=`basename $file`
  mv $file $dir/$DATE.nc
done
