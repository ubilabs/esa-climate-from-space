import os
import xarray as xr
from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument("-f", "--file", dest="file")
parser.add_argument("-v", "--variable", dest="variable")
parser.add_argument("--min", dest="min")
parser.add_argument("--max", dest="max")
args = parser.parse_args()

ds = xr.open_dataset(args.file, decode_coords=False, decode_cf=False)

if args.min != None:
  da = ds[args.variable]
  ds[args.variable] = da.where(da > float(args.min))

if args.max != None:
  da = ds[args.variable]
  ds[args.variable] = da.where(da < float(args.max))

os.remove(args.file)
ds.to_netcdf(args.file, format='NETCDF4_CLASSIC', mode='w')
