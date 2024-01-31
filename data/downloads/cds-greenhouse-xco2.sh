#!/usr/bin/env bash

# Download netcdf file from CDS
# https://cds.climate.copernicus.eu/cdsapp#!/dataset/satellite-carbon-dioxide?tab=form

# Processing Level: 3
# Variable: XCO2
# Sensor and algorithm: MERGED and OBS4MIPS
# Version: Latest choosable (4.4)

INPUT_FILE=./download/200301_202112-C3S-L3_GHG-GHG_PRODUCTS-MERGED-MERGED-OBS4MIPS-MERGED-v4.4.nc

OUTPUT_FOLDER=./download/xco2

mkdir -p $OUTPUT_FOLDER

python /data/split-time-dim.py --file $INPUT_FILE --folder $OUTPUT_FOLDER --variable xco2

for FILENAME in "$OUTPUT_FOLDER"/*; do
    python /data/mask-values.py --file "$FILENAME" --variable xco2 --max "100"
done

