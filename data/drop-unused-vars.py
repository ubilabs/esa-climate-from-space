import os
import xarray as xr
from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument("-f", "--file", dest="file")
parser.add_argument("-v", "--variable", dest="variable")
args = parser.parse_args()

ds = xr.open_dataset(args.file, decode_coords=False, decode_cf=False)

variables_to_keep = [args.variable, 'lat', 'lon', 'grid_projection']

for key in ds.data_vars:
    if (key not in variables_to_keep):
        ds = ds.drop_vars(names=[key])

os.remove(args.file)
ds.to_netcdf(args.file, format='NETCDF4', mode='w')
