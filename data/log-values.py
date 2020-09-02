import os
import xarray as xr
from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument("-f", "--file", dest="file")
parser.add_argument("-v", "--variable", dest="variable")
args = parser.parse_args()

ds = xr.open_dataset(args.file, decode_coords=True, decode_cf=True)
da = ds[args.variable]
ds[args.variable] = xr.ufuncs.log10(da)

os.remove(args.file)
ds.to_netcdf(args.file, format='NETCDF4', mode='w')
