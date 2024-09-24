import numpy as np
import pandas as pd
import geopandas as gpd
from datetime import datetime

# Load GeoDataFrame
gdf = gpd.read_file('rivers.geojson')

# Convert timestamps and calculate buffer sizes
gdf['timestamp'] = pd.to_datetime(gdf['timestamp'], format='%Y-%m-%d')

bufferSize = 50000 + (gdf['average_anomaly'].abs() * 50000)

gdf['buffer_size'] = bufferSize
gdf = gdf.to_crs(epsg=32633)  # Adjust CRS to one that uses meters for buffer calculations

# Create the outer buffer
gdf['outer_buffer'] = gdf.geometry.buffer(gdf['buffer_size'])

# Create the inner buffer (the size of the hole)
fixed_inner_buffer_size = 25000  # Fixed hole size in meters (e.g., 25000 meters = 25 km)
gdf['inner_buffer'] = gdf.geometry.buffer(fixed_inner_buffer_size)

# Apply the difference operation element-wise to create a ring (outer buffer minus inner buffer)
gdf['geometry'] = gdf.apply(lambda row: row['outer_buffer'].difference(row['inner_buffer']), axis=1)

# Ensure valid geometries (optional but recommended to clean any invalid geometries)
gdf['geometry'] = gdf['geometry'].buffer(0)

# Drop the temporary buffer columns
gdf = gdf.drop(columns=['outer_buffer', 'inner_buffer'])

# Filter data by month and store each month's data in a separate layer in a GeoPackage
start_date = datetime(2010, 1, 1)
end_date = datetime(2023, 12, 31)
current_date = start_date
while current_date <= end_date:
    print(current_date)
    # Filter data for the current month
    month_data = gdf[(gdf['timestamp'].dt.year == current_date.year) &
                     (gdf['timestamp'].dt.month == current_date.month)]
    if not month_data.empty:
        # Convert to WGS84 before saving
        month_data = month_data.to_crs(epsg=4326)
        # Define the layer name as 'data_YEAR_MONTH' (e.g., 'data_1993_01')
        layer_name = f"data_{current_date.year}_{current_date.month:02d}"
        # Write each month's data to a separate layer in the GeoPackage
        month_data.to_file("monthly_data.gpkg", layer=layer_name, driver="GPKG")

    # Increment to the next month
    next_month = current_date.month % 12 + 1
    next_year = current_date.year if next_month > 1 else current_date.year + 1
    current_date = datetime(next_year, next_month, 1)