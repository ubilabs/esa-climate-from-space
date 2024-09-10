import os
import pandas as pd
import xarray as xr
import geopandas as gpd
from io import StringIO

# Directory containing the CSV files
data_dir = "/data/downloads/download/xco2"

# Function to read the data into a pandas DataFrame
def read_altimetry_data(filename):
    """Reads the custom CSV file, cleaning up header and separator."""
    with open(filename, 'r') as f:
        lines = f.readlines()

    data_lines = [line.strip() for line in lines if not line.startswith("#")]
    df = pd.read_csv(StringIO('\n'.join(data_lines)), sep=' ', header=None)
    return df

# List to hold all dataframes
dfs = []

# Read all CSV files in the directory
for filename in os.listdir(data_dir):
    if filename.endswith(".csv"):
        file_path = os.path.join(data_dir, filename)
        df = read_altimetry_data(file_path)
        dfs.append(df)

# Concatenate all dataframes into a single dataframe
combined_df = pd.concat(dfs, ignore_index=True)

# Rename columns based on metadata
combined_df.columns = [
    "DATE",
    "TIME",
    "Water_Level_Orthometric",
    "Uncertainty",
    "Separator",
    "Longitude",
    "Latitude",
    "Ellipsoidal_Height",
    "Geoidal_Ondulation",
    "Distance_To_Reference",
    "Satellite",
    "Mission",
    "Ground_Track",
    "Cycle",
    "Retracking_Algorithm",
    "GDR_Version"
]

# Combine date and time into a datetime object
combined_df['Datetime'] = pd.to_datetime(combined_df['DATE'] + ' ' + combined_df['TIME'])
combined_df = combined_df.set_index('Datetime')

# Create an xarray Dataset
ds = xr.Dataset.from_dataframe(combined_df)

# Add metadata from the file header
# (Extract relevant metadata from the header and add it to the dataset)
ds.attrs['Basin'] = 'AMAZON'
ds.attrs['River'] = 'SOLIMOES'
ds.attrs['Reference_Longitude'] = -61.6976
ds.attrs['Reference_Latitude'] = -3.8308

# Save to NetCDF
ds.to_netcdf("R_AMAZON_SOLIMOES_mergedjason3-0076_S0376.nc")

combined_df = combined_df.reset_index()
combined_df.head()

gdf = gpd.GeoDataFrame(
    combined_df,
    geometry=gpd.points_from_xy(combined_df.Longitude, combined_df.Latitude),
    crs="EPSG:4326"  # Assuming your coordinates are in WGS84
)

print(gdf.head())

gdf.to_file("R_AMAZON_SOLIMOES_mergedjason3-0076_S0376.geojson", driver='GeoJSON')
