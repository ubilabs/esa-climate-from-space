FROM apache/airflow:2.4.2

USER root

RUN apt update && apt install -y software-properties-common && add-apt-repository ppa:ubuntugis/ppa && apt install -y libgdal-dev gdal-bin && sudo add-apt-repository -r ppa:ubuntugis/ppa
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && apt install -y nodejs && rm -rf /var/lib/apt/lists/*
RUN apt update && sudo apt install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev 

USER airflow

RUN sudo npm install -g canvas

