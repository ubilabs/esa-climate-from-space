from xcube.core.store import new_data_store
from datetime import datetime
from dateutil.relativedelta import relativedelta

# Initialize the data store
cci_store = new_data_store('esa-cci')

# Define the date range
start_date = '2003-01-01'
end_date = '2021-01-01'

# Parse datetime objects
f = "%Y-%m-%dT%H:%M:%S.%fZ"
start_date_time = datetime.strptime(start_date + "T12:00:00.000Z", f)
end_date_time = datetime.strptime(end_date + "T12:00:00.000Z", f)

# Generate monthly timestamps (1st of each month)
timestamps = []
current_date = start_date_time

while current_date <= end_date_time:
    timestamps.append(current_date)
    current_date += relativedelta(years=+1)

# Open the data cube once
cube = cci_store.open_data(
    'esacci.PERMAFROST.yr.L4.PFR.multi-sensor.multi-platform.MODISLST_CRYOGRID.04-0.r1',
    variable_names=['PFR'],
    time_range=[start_date, end_date]
)

# Loop through each timestamp (1st of each month)
for ts in timestamps:
    cube.PFR.sel(time=ts, method='nearest').to_netcdf(path='./permafrost/' + ts.strftime("%Y%m%d") + '.nc')