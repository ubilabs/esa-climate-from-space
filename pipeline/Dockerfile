FROM apache/airflow:2.8.1

USER root

# gdal
RUN apt update && apt install -y python3-launchpadlib software-properties-common && add-apt-repository ppa:ubuntugis/ppa && apt install -y libgdal-dev gdal-bin && sudo add-apt-repository -r ppa:ubuntugis/ppa
# gcloud
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | tee /etc/apt/sources.list.d/google-cloud-sdk.list

RUN curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -

RUN apt update && apt install google-cloud-cli -y
# nodejs + node-canvas module
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash
RUN apt update && apt install nodejs -y

RUN apt update && sudo apt install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
RUN npm install -g canvas
# git
RUN sudo apt install -y git

USER airflow

# xarray
RUN pip install xarray netcdf4 h5netcdf