FROM apache/airflow:2.8.1

USER root
SHELL ["/bin/bash", "-ec"]

# general dependencies
RUN apt update && apt install -y wget git

# gdal
RUN apt update && apt install -y python3-launchpadlib software-properties-common && add-apt-repository ppa:ubuntugis/ppa && apt install -y libgdal-dev gdal-bin && sudo add-apt-repository -r ppa:ubuntugis/ppa

# gcloud
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | tee /etc/apt/sources.list.d/google-cloud-sdk.list
RUN curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
RUN apt update && apt install -y google-cloud-cli

# nodejs + node-canvas module
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash
RUN apt update && apt install -y nodejs

RUN apt update && apt install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
RUN npm install -g canvas

# conda
RUN mkdir -p ~/miniconda3
RUN wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-aarch64.sh -O ~/miniconda3/miniconda.sh
RUN bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3
RUN rm -rf ~/miniconda3/miniconda.sh


#RUN source /root/.bashrc && ~/miniconda3/bin/conda create -y --name ect --channel conda-forge esa-climate-toolbox

# CCI Toolbox

ADD initialize-conda.sh /root/initialize-conda.sh
RUN ls -l ~
RUN chmod +x ~/initialize-conda.sh
RUN bash ~/initialize-conda.sh

USER airflow

# xarray
RUN pip install xarray netcdf4 h5netcdf
