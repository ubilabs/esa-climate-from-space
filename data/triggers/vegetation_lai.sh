BASE_URL="dap.ceda.ac.uk/neodc/esacci/vegetation_parameters/data/L3S/vp_products/v1.0/transect"

wget -e robots=off --mirror --no-parent -r https://$BASE_URL

OUTPUT_FOLDER=./download/vegetation_parameters

INPUT_FOLDER=./download/$BASE_URL

# Copies all tiles of same timestamp to OUTPUT_FOLDER
for YEAR in {2000..2020}; do
  mkdir -p $OUTPUT_FOLDER/$YEAR

  # All available tiles
  for TILE in X18Y02 X19Y00 X19Y01 X19Y02 X19Y03 X19Y04 X19Y05 X19Y06 X19Y07 X19Y08 X19Y09 X19Y10 X20Y01 X20Y02 X20Y03 X20Y04 X20Y05 X20Y06 X20Y07 X20Y08 X20Y09 X20Y10; do

    ITER=0
    for FILE in $INPUT_FOLDER/$YEAR/$TILE/*; do

      # Only use max 3 timestamps per month
      if (($(($ITER%3))==0))
      then 
        FOLDER=$OUTPUT_FOLDER/$YEAR/$(awk -F- '{print $7}' <<< $FILE)
        mkdir -p $FOLDER
        cp $FILE $FOLDER
      fi

      ITER=$(expr $ITER + 1)
    done
  done
done

# Merges tiles of same timestamp to one file
for YEAR in {2000..2020}; do
  for DATE in $OUTPUT_FOLDER/$YEAR/*; do
    FILES=""

    for FILE in $DATE/*.nc; do
      # Append file to files to merge list
      FILES=$FILES" NETCDF:"$FILE":LAI"
    done

    # Merge all tiles
    gdal_merge.py -of NETCDF -o $OUTPUT_FOLDER/$YEAR/${DATE##*/}/temp.nc $FILES

    # Convert LAI value to human readable physical value (m²/m²). See https://climate.esa.int/media/documents/VP-CCI_D4.2_PUG_V1.2.pdf page 18.
    gdal_calc.py --format NETCDF -A $OUTPUT_FOLDER/$YEAR/${DATE##*/}/temp.nc --outfile=$OUTPUT_FOLDER"/"${DATE##*/}".nc" --calc="(A * 0.000122074)+4"

    rm $OUTPUT_FOLDER/$YEAR/${DATE##*/}/temp.nc
  done
  rm -R $OUTPUT_FOLDER/$YEAR
done