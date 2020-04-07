import sys
import time
import utility
import cate.ops
from cate.core.ds import DATA_STORE_REGISTRY
from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument("-i", "--input", dest="input_files", default="/data/netcdfs/*.nc")
parser.add_argument("-l", "--layer", dest="layer_id")
parser.add_argument("-v", "--variable", dest="variable_id")
parser.add_argument("-o", "--output", dest="output")
args = parser.parse_args()

# add local datastore from NetCDF files
start_time = time.time()
local_store = DATA_STORE_REGISTRY.get_data_store('local')
ds_name = 'data'
ds_local_name = 'local.' + ds_name
files = args.input_files
local_store.add_pattern(ds_name, files)

# open dataset
ds = cate.ops.open_dataset(ds_local_name, var_names=args.variable_id)
data_array = ds[args.variable_id]
print(f'Opened dataset in {time.time() - start_time}s')

# get min and max values
min = float(data_array.min(dim="time", skipna=True).min())
max = float(data_array.max(dim="time", skipna=True).max())

# re-chunk to full size chunks so that xcube automatically creates full size images
shape = data_array.shape
data_array = data_array.chunk({'lon': shape[2], 'lat': shape[1]})

# write zarr file to disk
start_time = time.time()
print('Writing zarr file...')
data_array.to_dataset().to_zarr(args.output)
print(f'Written zarr in {time.time() - start_time}s')

print('Writing style file...')
utility.write_style_file(args.layer_id, args.variable_id, min, max)

print('Writing world file...')
utility.write_world_file(ds)

print('Writing metadata file...')
utility.write_metadata_file(args.layer_id, args.variable_id, data_array.time, shape, min, max)



