import os
import xarray as xr
from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument("-f", "--file", dest="file")
parser.add_argument("-v", "--variable", dest="variable")
args = parser.parse_args()

vars_to_keep = [args.variable, 'lat', 'lon', 'time']

ds = xr.open_dataset(args.file)
drop_vars = [v for v in ds.variables if v not in vars_to_keep]
ds_new = ds.drop_vars(drop_vars)

os.remove(args.file)
ds_new.to_netcdf(args.file, format='NETCDF4_CLASSIC', mode='w')
