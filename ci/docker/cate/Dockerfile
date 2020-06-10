# build with commit #a23131d7147e67f7a65029a3e90751bf6186b566

FROM continuumio/miniconda3:latest

SHELL ["/bin/bash", "-c"]
WORKDIR /cate

RUN git clone https://github.com/CCI-Tools/cate.git .
RUN git checkout a23131d7147e67f7a65029a3e90751bf6186b566 && conda env create
RUN conda run -n cate-env python setup.py install
RUN echo 'conda activate cate-env' >> ~/.bashrc

CMD /bin/bash
