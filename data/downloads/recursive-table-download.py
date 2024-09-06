import requests
from bs4 import BeautifulSoup
import os
from urllib.parse import urljoin, urlparse

# This script downloads the files from the CEDA archive for the ESA CCI River Discharge dataset.
# The script navigates recursively through the directory structure to find the download links and save the files.

# Base URL
base_url = "https://data.ceda.ac.uk/neodc/esacci/river_discharge/data/WL/v1.1/CSV/merged_timeseries/"

# Directory to save the downloaded files
download_dir = "download/xco2"

# Boolean flag to track if any failures occurred
had_failures = False

# Function to log messages to a file
def log_message(message):
    print(message)

# Recursive function to navigate through the links and download the file
def find_and_download(url):
    try:
        # Fetch the page content
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        log_message(f"Failed to fetch {url}: {e}")
        global had_failures
        had_failures = True
        return

    soup = BeautifulSoup(response.content, "html.parser")
    # Find the table containing the links
    # This works because the tables containing the links have a the same specific class
    table = soup.find("table", class_="table table-sm")

    if not table:
        log_message(f"No table found at {url}")
        had_failures = True
        return

    # Find all rows in the table
    rows = table.find_all("tr")
    
    for row in rows:
        link = row.find("a")

        if link and "href" in link.attrs:
            href = link["href"]
            next_url = urljoin(url, href)  # Use urljoin to create the full URL

            # Check if the link contains the word "download"
            # This is a simple way to identify the download links
            if "download" in href:
                download_file(next_url)
                return  # Stop further exploration once the file is downloaded
            else:
                # Recursive call to explore the next URL
                find_and_download(next_url)

# Function to download the file
def download_file(file_url):
    global had_failures

    # Ensure the download directory exists
    os.makedirs(download_dir, exist_ok=True)

    # Extract the file name from the URL path, ignoring query parameters
    parsed_url = urlparse(file_url)
    file_name = os.path.basename(parsed_url.path)

    # Full file path in the download directory
    file_path = os.path.join(download_dir, file_name)
    
    try:
        log_message(f"Attempting to download {file_url}")
        response = requests.get(file_url)
        response.raise_for_status()

        # Save the file to the download directory
        with open(file_path, "wb") as file:
            file.write(response.content)
        
        log_message(f"Download successful: {file_path}")

    except requests.RequestException as e:
        log_message(f"Download failed for {file_url}: {e}")
        had_failures = True

# Start the process
log_message("Starting download process...")
find_and_download(base_url)

# Log the final message based on whether there were failures
if had_failures:
    log_message("Download script finished with some failures.")
else:
    log_message("Download script finished successfully, all files downloaded.")
