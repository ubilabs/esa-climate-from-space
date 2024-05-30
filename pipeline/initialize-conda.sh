#!/bin/bash

conda init bash

source ~/.bashrc

conda create -y --name ect --channel conda-forge esa-climate-toolbox
conda info --envs

echo 'source activate ect' >> ~/.bashrc
