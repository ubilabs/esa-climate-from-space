#!/bin/bash

~/miniconda3/bin/conda init bash
source ~/.bashrc

conda create -y --name ect --channel conda-forge esa-climate-toolbox↲
conda info --envs

conda activate ect
