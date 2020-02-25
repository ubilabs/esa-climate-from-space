import cate.ops
from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument("-d", "--dataset", dest="dataset_id")
parser.add_argument("-v", "--variable", dest="variable_id")
parser.add_argument("-t", "--time_range", dest="time_range")
args = parser.parse_args()

# Cloud build substitutions do not allow commas
time_range = args.time_range.replace('.', ',');

print("dataset_id: ", args.dataset_id)
print("variable_id: ", args.variable_id)
print("time_range: ", time_range)

print('Downloading dataset...')
ds = cate.ops.open_dataset(ds_id=args.dataset_id, time_range=time_range, var_names=args.variable_id, force_local=True)
print('Writing zarr file...')
ds.to_zarr("./cube.zarr")
