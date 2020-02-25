FROM continuumio/miniconda3:latest

SHELL ["/bin/bash", "-c"]
WORKDIR /xcube

RUN git clone https://github.com/dcs4cop/xcube.git .
RUN conda env create
RUN conda run -n xcube python setup.py develop
RUN echo 'conda activate xcube' >> ~/.bashrc

CMD /bin/bash
