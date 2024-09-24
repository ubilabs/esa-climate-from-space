import os
import rioxarray
import shutil

# Folder path containing the GeoTIFF files
folder_path = "./geotiff_output"
nc_folder_path = "nc_output"

# Create the output folder for NetCDF files if it does not exist
if not os.path.exists(nc_folder_path):
    os.makedirs(nc_folder_path)

# Iterate through each file in the folder
for file in os.listdir(folder_path):
    if file.endswith(".tiff"):
        file_path = os.path.join(folder_path, file)

        # Open the GeoTIFF as an xarray dataset using rioxarray
        ds = rioxarray.open_rasterio(file_path)

        # Optional: Reproject to a specific projected CRS if needed
        # ds = ds.rio.reproject("EPSG:XXXX")

        # Set the coordinate names to longitude and latitude for clarity
        ds = ds.rename({"x": "longitude", "y": "latitude"})

        ds = ds.isel(band=0).rename("water_level_anomaly")

        parts = file.replace('.tiff', '').split('_')

        # Extract the year and month
        year = parts[1]  # "2012"
        month = parts[2] 

        # Construct the output file path with the same name as the GeoTIFF
        nc_file_path = os.path.join(nc_folder_path, f"{year + month + '01'}.nc")

        # Save each dataset as a separate NetCDF file
        ds.to_netcdf(nc_file_path)


# Path to the output folder containing the NetCDF files
nc_folder_path = "nc_output"

# Path for the zipped file
zip_path = "nc_output.zip"

# Compress the entire folder containing the NetCDF files into a zip file
shutil.make_archive(base_name=zip_path[:-4], format='zip', root_dir=nc_folder_path)