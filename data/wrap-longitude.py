import os
import xarray as xr
import numpy as np
from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument("-f", "--file", dest="file")
args = parser.parse_args()

ds = xr.open_dataset(args.file)


def wrap(x):
    return x if x < 180 else (x - 360)

try:
  lon_key = 'lon'
  ds.coords[lon_key]
except KeyError:
  lon_key = 'longitude'


ds.coords[lon_key] = np.array([wrap(xi) for xi in ds[lon_key]])

ds = ds.reindex({ lon_key : np.sort(ds[lon_key])})

os.remove(args.file)
ds.to_netcdf(args.file, format='NETCDF4_CLASSIC', mode='w')
