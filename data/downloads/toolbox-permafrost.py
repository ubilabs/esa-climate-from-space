from xcube.core.store import new_data_store
from datetime import datetime

# Initialize the data store
cci_store = new_data_store('esa-cci')

# Define the date range
start_date = '2003-07-02'
end_date = '2021-07-02'

# Open the data cube once
cube = cci_store.open_data(
    'esacci.PERMAFROST.yr.L4.PFR.multi-sensor.multi-platform.MODISLST_CRYOGRID.04-0.r1',
    variable_names=['PFR'],
    time_range=[start_date, end_date]
)

# Loop through each timestamp in cube.time.values
for ts in cube.time.values:
    ts_datetime = datetime.utcfromtimestamp(ts.astype('O') / 1e9)  # Convert numpy.datetime64 to datetime
    output_path = f'./permafrost/{ts_datetime.strftime("%Y%m%d")}.nc'
    cube.PFR.sel(time=ts, method='nearest').to_netcdf(path=output_path)
