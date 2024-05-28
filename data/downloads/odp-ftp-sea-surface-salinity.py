from xcube.core.store import new_data_store
from datetime import timedelta, datetime
from dateutil.relativedelta import *

cci_store = new_data_store('esa-cci')

start_date = '2010-01-01'
end_date = '2022-10-15'
number_of_timestamps = 307

cube = cci_store.open_data('esacci.SEASURFACESALINITY.15-days.L4.SSS.multi-sensor.multi-platform.GLOBAL-MERGED_OI_Monthly_CENTRED_15Day_0-25deg.4-41.r1',
                           variable_names=['sss'],
                           time_range=[start_date, end_date])

s = start_date + "T12:00:00.000Z"
f = "%Y-%m-%dT%H:%M:%S.%fZ"
date = datetime.strptime(s, f)

for index in range(number_of_timestamps):

    if index:
        if index % 2:
            # 15th of the month
            date = date + timedelta(days=14)
        else:
            # First of the month
            date = date + timedelta(days=-14) + relativedelta(months=+1)

    cube.sss.sel(time=date, method='nearest').to_netcdf(path='./' + date.strftime("%Y%m%d") + '.nc')