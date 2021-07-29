import os
import xarray as xr
import pandas as pd
from datetime import datetime
from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument("-f", "--file", dest="file")
parser.add_argument("-o", "--folder", dest="folder")
parser.add_argument("-v", "--variable", dest="variable")
args = parser.parse_args()

ds = xr.open_dataset(args.file, decode_coords=True, decode_cf=True)
da = ds[args.variable]

for n in range(len(da.time)):
  da_slice = da.isel(time=n)
  date = pd.to_datetime(str(da_slice.time.values))
  filename = date.strftime('%s/%%Y%%m%%d.nc' % (args.folder))
  print(filename)
  da_slice.to_dataset().to_netcdf(filename, format='NETCDF4', mode='w')
