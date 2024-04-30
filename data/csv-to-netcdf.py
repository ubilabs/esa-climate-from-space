from os import listdir
from os.path import isfile, join
import pandas as pd
# Execute pip install xarray first
import xarray


onlyfiles = [f for f in listdir('./data') if isfile(join('./data', f))]

for file in onlyfiles:
    print(join('./data/', file))
    content = pd.read_csv(join('./data',file))

    df = pd.DataFrame(content)

    # Create xray Dataset from Pandas DataFrame
    xr = xarray.Dataset.from_dataframe(df)

    # Save to netCDF
    xr.to_netcdf(join('./data', file+'.nc'))
