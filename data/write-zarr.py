import sys
import cate.ops
import utility
from cate.core.ds import DATA_STORE_REGISTRY
from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument("-i", "--input", dest="input_files", default="/data/netcdfs/*.nc")
parser.add_argument("-l", "--layer", dest="layer_id")
parser.add_argument("-v", "--variable", dest="variable_id")
parser.add_argument("-z", "--zoom-levels", dest="zoom_levels")
parser.add_argument("--min", dest="min", default="auto")
parser.add_argument("--max", dest="max", default="auto")
parser.add_argument("-o", "--output", dest="output")
args = parser.parse_args()

zoom_levels = args.zoom_levels.split('-')

# add local datastore from NetCDF files
local_store = DATA_STORE_REGISTRY.get_data_store('local')
ds_name = 'data'
ds_local_name = 'local.' + ds_name
files = args.input_files
local_store.add_pattern(ds_name, files)

# open dataset
ds = cate.ops.open_dataset(ds_local_name, var_names=args.variable_id)
data_array = ds[args.variable_id]
units = data_array.get('units') or data_array.attrs['Units']

# get min and max values
try:
  min = float(args.min)
except ValueError:
  min = float(data_array.min(dim="time", skipna=True).min())

try:
  max = float(args.max)
except ValueError:
  max = float(data_array.max(dim="time", skipna=True).max())

# clip values here so that we don't have to pass min/max to xcube
data_array = data_array.clip(min, max)

if args.output != None:
  # re-chunk to full size chunks so that xcube automatically creates full size images
  shape = data_array.shape
  data_array = data_array.chunk({'lon': shape[2], 'lat': shape[1]})

  # write zarr file to disk
  print('Writing zarr file...')
  data_array.to_dataset().to_zarr(args.output)

  print('Writing world file...')
  utility.write_world_file(shape, ds.attrs)

  print('Writing style file...')
  utility.write_style_file(args.layer_id, args.variable_id, min, max)

# always write metadata file
print('Writing metadata file...')
total_zoom_levels = int(zoom_levels[1]) + 1
utility.write_metadata_file(
  args.layer_id,
  args.variable_id,
  units,
  data_array.time,
  total_zoom_levels,
  min,
  max
)
