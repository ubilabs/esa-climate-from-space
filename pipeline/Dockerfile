FROM apache/airflow:2.8.1

USER root

# gdal
RUN apt update && apt install -y software-properties-common && add-apt-repository ppa:ubuntugis/ppa && apt install -y libgdal-dev gdal-bin && sudo add-apt-repository -r ppa:ubuntugis/ppa
# gcloud
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg  add - && apt-get update -y && apt-get install google-cloud-cli -y
# nodejs + node-canvas module
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && apt install -y nodejs && rm -rf /var/lib/apt/lists/*
RUN apt update && sudo apt install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
RUN sudo npm install -g canvas
# git
RUN sudo apt install -y git

USER airflow

# xarray
RUN pip install xarray netcdf4 h5netcdf



