import os
from ftplib import FTP

ftp = FTP('anon-ftp.ceda.ac.uk')
ftp.login()

BASE_PATH = '/neodc/esacci/snow/data/swe/MERGED/v1.0'
OUTPUT_PATH = f"{os.getcwd()}/download/snow"

years = range(1979, 2018)

for year in years:
  months = ftp.nlst(f'{BASE_PATH}/{year}/')

  for month in months:
    days = ftp.nlst(month)
    first_day = days[0]
    file_name = first_day.split('/').pop().split('-')[0]

    with open(f"{OUTPUT_PATH}/{file_name}.nc", 'wb') as fp:
      ftp.retrbinary(f"RETR {first_day}", fp.write)
      print(file_name)

ftp.quit()
