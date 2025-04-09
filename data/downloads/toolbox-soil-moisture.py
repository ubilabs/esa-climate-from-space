from xcube.core.store import new_data_store
from datetime import datetime
from dateutil.relativedelta import relativedelta

# Initialize the data store
cci_store = new_data_store('esa-cci')

# Define the date range
start_date = '2003-02-01'
end_date = '2023-12-31'

# Parse datetime objects
f = "%Y-%m-%dT%H:%M:%S.%fZ"
start_date_time = datetime.strptime(start_date + "T12:00:00.000Z", f)
end_date_time = datetime.strptime(end_date + "T12:00:00.000Z", f)

# Generate monthly timestamps (1st of each month)
timestamps = []
current_date = start_date_time

while current_date <= end_date_time:
    timestamps.append(current_date)
    current_date += relativedelta(months=+1)

# Open the data cube once
cube = cci_store.open_data(
    'esacci.SOILMOISTURE.day.L3S.SSMV.multi-sensor.multi-platform.COMBINED.v09-1.r1',
    variable_names=['sm'],
    time_range=[start_date, end_date]
)

# Loop through each timestamp (1st of each month)
for ts in timestamps:
    cube.sm.sel(time=ts, method='nearest').to_netcdf(path='./' + ts.strftime("%Y%m%d") + '.nc')