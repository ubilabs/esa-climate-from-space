import os
from datetime import datetime
from ftplib import FTP

ftp = FTP('anon-ftp.ceda.ac.uk')
ftp.login()

BASE_PATH = 'neodc/esacci/ozone/data/total_columns/l3/merged/v0100'
OUTPUT_PATH = f"{os.getcwd()}/download/ozone"

years = range(1996, 2011)

for year in years:
  files = ftp.nlst(f'{BASE_PATH}/{year}/')

  for file in files:
    file_name = file.split('-')[-2]
    date = datetime.strptime(file_name, '%Y%m%d').strftime('%Y-%m-%d')
    out = f"{OUTPUT_PATH}/{file_name}.nc"

    with open(out, 'wb') as fp:
      ftp.retrbinary(f"RETR {file}", fp.write)
      print(file_name)

    os.system(f"python ./data/drop-unused-vars.py --file {out} --variable atmosphere_mole_content_of_ozone")
    os.system(f"python {os.getcwd()}/data/add-time-coordinate.py --file {out} --timestamp {date}")
    os.system(f"python ./data/wrap-longitude.py --file {out}")

ftp.quit()
