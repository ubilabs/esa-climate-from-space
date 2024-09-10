import ftplib
import os

# Base FTP URL
ftp_url = "anon-ftp.ceda.ac.uk"
base_path = "/neodc/esacci/river_discharge/data/WL/v1.1/CSV/merged_timeseries/"

# Directory to save the downloaded files
download_dir = "download/xco2"

# Boolean flag to track if any failures occurred
had_failures = False

# Function to log messages to a file
def log_message(message):
    print(message)

# Recursive function to navigate through the FTP directory and download files
def download_ftp_dir(ftp, path):
    global had_failures

    ftp.cwd(path)
    file_list = ftp.nlst()

    for file_name in file_list:
        if is_ftp_dir(ftp, file_name):
            download_ftp_dir(ftp, file_name)
            ftp.cwd("..")
        else:
            local_path = os.path.join(download_dir, file_name)
            try:
                with open(local_path, "wb") as local_file:
                    log_message(f"Downloading {file_name} to {local_path}")
                    ftp.retrbinary(f"RETR {file_name}", local_file.write)
                log_message(f"Download successful: {local_path}")
            except ftplib.error_perm as e:
                log_message(f"Download failed for {file_name}: {e}")
                had_failures = True

# Function to check if a path is a directory on the FTP server
def is_ftp_dir(ftp, path):
    current = ftp.pwd()
    try:
        ftp.cwd(path)
        ftp.cwd(current)
        return True
    except ftplib.error_perm:
        return False

# Start the process
log_message("Starting download process...")

# Ensure the download directory exists
os.makedirs(download_dir, exist_ok=True)

try:
    with ftplib.FTP(ftp_url) as ftp:
        ftp.login()
        download_ftp_dir(ftp, base_path)
except ftplib.all_errors as e:
    log_message(f"FTP error: {e}")
    had_failures = True

# Log the final message based on whether there were failures
if had_failures:
    log_message("Download script finished with some failures.")
else:
    log_message("Download script finished successfully, all files downloaded.")
