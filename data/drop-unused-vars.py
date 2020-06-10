import os
import xarray as xr
from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument("-f", "--file", dest="file")
parser.add_argument("-v", "--variable", dest="variable")
args = parser.parse_args()

ds = xr.open_dataset(args.file, decode_coords=False, decode_cf=False)
ds_new = ds[args.variable].to_dataset()
ds_new.attrs = ds.attrs

os.remove(args.file)
ds_new.to_netcdf(args.file, format='NETCDF4_CLASSIC', mode='w')
