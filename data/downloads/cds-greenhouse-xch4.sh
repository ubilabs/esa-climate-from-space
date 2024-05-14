#!/usr/bin/env bash

# Download netcdf file from CDS
# https://cds.climate.copernicus.eu/cdsapp#!/dataset/satellite-methane?tab=form

# Processing Level: 3
# Variable: XCH4
# Sensor and algorithm: MERGED and OBS4MIPS
# Version: Latest choosable (4.4)

INPUT_FILE=./download/200301_202112-C3S-L3_GHG-GHG_PRODUCTS-MERGED-MERGED-OBS4MIPS-MERGED-v4.4.nc

OUTPUT_FOLDER=./download/xch4

mkdir -p $OUTPUT_FOLDER

python /data/split-time-dim.py --file $INPUT_FILE --folder $OUTPUT_FOLDER --variable xch4

for FILENAME in "$OUTPUT_FOLDER"/*; do
    python /data/mask-values.py --file "$FILENAME" --variable xch4 --max "100"
done

