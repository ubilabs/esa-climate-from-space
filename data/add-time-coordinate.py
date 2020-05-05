import os
import xarray as xr
import pandas as pd
from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument("-f", "--file", dest="file")
parser.add_argument("-t", "--timestamp", dest="timestamp")
args = parser.parse_args()

ds = xr.open_dataset(args.file, decode_cf=False)

new_time = pd.to_datetime([args.timestamp])
ds = ds.expand_dims(dim={'time': new_time}, axis=0)

os.remove(args.file)
ds.to_netcdf(args.file, format='NETCDF4', mode='w')
