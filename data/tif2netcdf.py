import xarray as xr
import rasterio
from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument("-f", "--file", dest="file")
parser.add_argument("-o", "--output", dest="output")
parser.add_argument("-v", "--variable", dest="variable")
args = parser.parse_args()

da = xr.open_rasterio(args.file)
ds = da.to_dataset(name=args.variable)
ds.to_netcdf(args.output, format='NETCDF4', mode='w')
