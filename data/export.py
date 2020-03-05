import cate.ops
import sys
import json
from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument("-l", "--layer", dest="layer_name")
parser.add_argument("-d", "--dataset", dest="dataset_id")
parser.add_argument("-v", "--variable", dest="variable_id")
parser.add_argument("-t", "--time_range", dest="time_range")
parser.add_argument("-o", "--output", dest="output")
args = parser.parse_args()

if not args.output:
  sys.exit("Output folder not specified (e.g. use --output ./tiles)")

# Cloud build substitutions do not allow commas
time_range = args.time_range.replace('.', ',');

print("layer_name: ", args.layer_name)
print("dataset_id: ", args.dataset_id)
print("variable_id: ", args.variable_id)
print("time_range: ", time_range)

# print('Downloading dataset...')
ds = cate.ops.open_dataset(ds_id=args.dataset_id, time_range=time_range, var_names=args.variable_id, force_local=True)
# print('Writing zarr file...')
ds.to_zarr(args.output)

# write a xcube style config
min = float(ds[args.variable_id].min(dim="time", skipna=True).min())
max = float(ds[args.variable_id].max(dim="time", skipna=True).max())

# load layer config file for colormap
with open('./data/layers-config.json') as f:
  layer_config = json.load(f)

style_config = """Styles:
  - Identifier: cfs
    ColorMappings:
      {variable}:
        ColorBar: {colormap}
        ValueRange: [{min}, {max}]""".format(
          min=min,
          max=max,
          variable=args.variable_id,
          colormap=layer_config[args.layer_name]['colorMap']
        )

print(style_config)

with open('./style.yaml', 'w') as f:
  f.write(style_config)
