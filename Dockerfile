FROM python:3

WORKDIR /usr/src/app

RUN pip install --no-cache-dir xarray netCDF4 scipy

COPY ./data/csv-to-netcdf.py .

CMD [ "python", "./csv-to-netcdf.py" ]
