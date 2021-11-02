from datetime import time
import xarray as xr
import rasterio
import pandas as pd
import re
from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument("-f", "--file", dest="file")
parser.add_argument("-o", "--output", dest="output")
parser.add_argument("-v", "--variable", dest="variable")
args = parser.parse_args()

da = xr.open_rasterio(args.file)
ds = da.to_dataset(name=args.variable)

timestamp = re.search("(\d+).tif$", args.file).group(0)
timestamp = timestamp[0:4] + '-' + timestamp[4:6] + '-' + timestamp[6:8]
new_time = pd.to_datetime([timestamp])
ds = ds.expand_dims(dim={'time': new_time}, axis=0)

comp = dict(zlib=True, complevel=5)
encoding = {var: comp for var in ds.data_vars}
ds.to_netcdf(args.output, format='NETCDF4', mode='w', encoding=encoding)
