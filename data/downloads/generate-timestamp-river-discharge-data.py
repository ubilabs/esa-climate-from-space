import os
import pandas as pd
import geopandas as gpd
from io import StringIO
import json

# Directory containing the CSV files
data_dir = "/data/downloads/download/xco2"

# Function to read the data into a pandas DataFrame and extract metadata
def read_altimetry_data(filename):
    """Reads the custom CSV file, cleaning up header and separator."""
    metadata = {}
    data_lines = []
    with open(filename, 'r') as f:
        lines = f.readlines()

    for line in lines:
        if line.startswith("#"):
            key_value = line[1:].strip().split("::")
            if len(key_value) == 2:
                key, value = key_value
                metadata[key.strip()] = value.strip()
        else:
            data_lines.append(line.strip())

    df = pd.read_csv(StringIO('\n'.join(data_lines)), sep=' ', header=None)
    return metadata, df

# List to hold all GeoJSON features
features = []

# Read all CSV files in the directory
for filename in os.listdir(data_dir):
    if filename.endswith(".csv"):
        file_path = os.path.join(data_dir, filename)
        metadata, df = read_altimetry_data(file_path)

        # Rename columns based on metadata
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

        # Combine date and time into a datetime object
        df['Datetime'] = pd.to_datetime(df['DATE'] + ' ' + df['TIME'], errors='coerce')

        # Filter out rows with NaT values in 'Datetime'
        df = df.dropna(subset=['Datetime'])

        # Group by month and calculate the average value
        df['Month'] = df['Datetime'].dt.to_period('M')
        monthly_avg = df.groupby('Month')['Water_Level_Orthometric'].mean().reset_index()

        # Ensure no NaT values in 'Month'
        monthly_avg = monthly_avg.dropna(subset=['Month'])
        # Ensure no NaN values in 'Water_Level_Orthometric'
        monthly_avg = monthly_avg.dropna(subset=['Water_Level_Orthometric'])

        # Create a feature for each month
        for _, row in monthly_avg.iterrows():
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [float(metadata['REFERENCE LONGITUDE']), float(metadata['REFERENCE LATITUDE'])]
                },
                "properties": {
                    "timestamp": row['Month'].to_timestamp().isoformat(),
                    "metadata": metadata,
                    "average_value": row['Water_Level_Orthometric'],
                }
            }
            features.append(feature)

# Create GeoJSON FeatureCollection
geojson = {
    "type": "FeatureCollection",
    "features": features
}

# Save to GeoJSON file
output_file = "monthly_R_AMAZON_SOLIMOES_mergedjason3-0076_S0376.geojson"
with open(output_file, 'w') as f:
    json.dump(geojson, f, indent=2)

print(f"GeoJSON file saved to {output_file}")
