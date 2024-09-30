import os
import geopandas as gpd
import rasterio
from rasterio.features import rasterize

# Path to your GeoPackage file
gpkg_path = 'monthly_data.gpkg'

# Create output directory for GeoTIFFs
output_folder = 'geotiff_output'
os.makedirs(output_folder, exist_ok=True)

# List all layers in the GeoPackage
layers = gpd.io.file.fiona.listlayers(gpkg_path)
print("Layers in GeoPackage:", layers)

for layer in layers:
    # Read the GeoDataFrame
    gdf = gpd.read_file(gpkg_path, layer=layer)

    print(layer)

    # Define global bounds for the raster [-180, -90, 180, 90] (minx, miny, maxx, maxy)
    global_bounds = (-180, -90, 180, 90)
    width = 8192  # Set width to 8192 pixels for the whole globe
    pixel_size = (global_bounds[2] - global_bounds[0]) / width  # Calculate pixel size based on the width
    height = int((global_bounds[3] - global_bounds[1]) / pixel_size)  # Calculate height based on pixel size

    # Define the transformation from pixel coordinates to geographic coordinates
    transform = rasterio.transform.from_origin(global_bounds[0], global_bounds[3], pixel_size, pixel_size)

    # Rasterize the geometries with average_value encoded
    raster = rasterize(
        [(geom, value) for geom, value in zip(gdf.geometry, gdf['average_anomaly'])],
        out_shape=(height, width),
        transform=transform,
        fill=0,  # Background value
        all_touched=True,
        dtype='float32'  # Change dtype to float32 to accommodate average_value
    )

    output_path = output_folder + "/" + layer + ".tiff"

    # Continue with the rest of your code to save the raster
    with rasterio.open(
        output_path, 'w',
        driver='GTiff',
        height=raster.shape[0],
        width=raster.shape[1],
        count=1,
        dtype=raster.dtype,
        crs=gdf.crs,
        transform=transform,
    ) as dst:
        dst.write(raster, 1)

    print(f"Rasterized layer '{layer}' has been saved to {output_path}")