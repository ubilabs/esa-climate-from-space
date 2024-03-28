

BASE_URL="dap.ceda.ac.uk/neodc/esacci/high_resolution_land_cover/data/land_cover_maps"

OUTPUT_FOLDER=./download/land_cover

INPUT_FOLDER=./$BASE_URL

mkdir -p $OUTPUT_FOLDER

for PLACE in A01_Africa A02_Amazonia A03_Siberia; do

  mkdir -p $OUTPUT_FOLDER/$PLACE

  # A01, A02 or AO3
  PREFIX=$(awk -F_ '{print $1}' <<< $PLACE)

  echo $PREFIX

  for YEAR in 1990 1995 2000 2005 2010 2015 2019; do

    FILE=$PLACE/historical/v1.2/geotiff/HRLC30/mosaic/ESACCI-HRLC-L4-MAP-CL01-$PREFIX"MOSAIC-30m-P5Y-"$YEAR-fv01.2.tif

    wget -e robots=off --mirror --no-parent -r https://$BASE_URL/$FILE

    INPUT_FILE=./$BASE_URL/$FILE
    OUTPUT_FILE=$OUTPUT_FOLDER/$PLACE/$YEAR"0101.nc"

    gdal_translate -of netcdf $INPUT_FILE $OUTPUT_FILE

  done

done