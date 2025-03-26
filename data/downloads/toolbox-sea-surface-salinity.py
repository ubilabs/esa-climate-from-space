from xcube.core.store import new_data_store
from datetime import timedelta, datetime
from dateutil.relativedelta import *

cci_store = new_data_store('esa-cci')

start_date = '2010-01-01'
end_date = '2023-12-31'
day_interval = 15

s = start_date + "T12:00:00.000Z"
e = end_date + "T12:00:00.000Z"
f = "%Y-%m-%dT%H:%M:%S.%fZ"
start_date_time = datetime.strptime(s, f)
end_date_time = datetime.strptime(e, f)

# Define interval
interval = timedelta(days=day_interval)

# Generate timestamps and count them
timestamps = []
current_date = start_date_time

while current_date <= end_date_time:
    timestamps.append(current_date)
    current_date += interval

number_of_timestamps = len(timestamps)

cube = cci_store.open_data('esacci.SEASURFACESALINITY.15-days.L4.SSS.multi-sensor.multi-platform.GLOBAL-MERGED_OI_Monthly_CENTRED_15Day_0-25deg.5-5.r1',
                           variable_names=['sss'],
                           time_range=[start_date, end_date])

for index in range(number_of_timestamps):

    if index:
        if index % 2:
            # 15th of the month
            start_date_time = start_date_time + timedelta(days=day_interval - 1)
        else:
            # First of the month
            start_date_time = start_date_time + timedelta(days=-(day_interval - 1)) + relativedelta(months=+1)

    cube.sss.sel(time=start_date_time, method='nearest').to_netcdf(path='./' + start_date_time.strftime("%Y%m%d") + '.nc')