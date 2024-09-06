import pandas as pd
import xarray as xr
import geopandas as gpd
from io import StringIO

# 1. Read the data into a pandas DataFrame
def read_altimetry_data(filename):
    """Reads the custom CSV file, cleaning up header and separator."""
    with open(filename, 'r') as f:
        lines = f.readlines()

    data_lines = [line.strip() for line in lines if not line.startswith("#")]
    df = pd.read_csv(StringIO('\n'.join(data_lines)), sep=' ', header=None)
    return df

df = read_altimetry_data("./download/xco2/R_AMAZON_AMAZONA_KMXXXX_mergedjason3-0228_S0234 copy.csv")

# 2. Rename columns based on metadata
df.columns = [
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

# 3. Combine date and time into a datetime object
df['Datetime'] = pd.to_datetime(df['DATE'] + ' ' + df['TIME'])
df = df.set_index('Datetime')

# 4. Create an xarray Dataset
ds = xr.Dataset.from_dataframe(df)

# 5. Add metadata from the file header
# (Extract relevant metadata from the header and add it to the dataset)
ds.attrs['Basin'] = 'AMAZON'
ds.attrs['River'] = 'SOLIMOES'
ds.attrs['Reference_Longitude'] = -61.6976
ds.attrs['Reference_Latitude'] = -3.8308

# 6. Save to NetCDF
ds.to_netcdf("R_AMAZON_SOLIMOES_mergedjason3-0076_S0376.nc")

df = df.reset_index()
df.head()

gdf = gpd.GeoDataFrame(
    df,
    geometry=gpd.points_from_xy(df.Longitude, df.Latitude),
    crs="EPSG:4326"  # Assuming your coordinates are in WGS84
)

print(gdf.head())

gdf.to_file("R_AMAZON_SOLIMOES_mergedjason3-0076_S0376.geojson", driver='GeoJSON')