# Use ARM64-compatible base image with up-to-date conda + libraries
FROM condaforge/miniforge3:latest

# Set working directory
WORKDIR /opt/esa-climate-toolbox

# Install git and build tools
RUN apt-get update && \
    apt-get install -y git build-essential && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Clone the ESA Climate Toolbox repository
RUN git clone https://github.com/esa-cci/esa-climate-toolbox.git . && \
    git checkout tags/v1.4 && \
    git submodule update --init --recursive

# Create conda environment and install dependencies
RUN conda create -n cci-toolbox python=3.10 -y && \
    /bin/bash -c "source activate cci-toolbox && \
    conda install -y mamba -c conda-forge && \
    mamba env update -n cci-toolbox -f environment.yml && \
    pip install . && \
    pip install pydap==3.4 && \
    pip install 'numpy<2'"

# Ensure conda environment activates by default
RUN echo "conda activate cci-toolbox" >> ~/.bashrc

# Activate environment by default in shell
SHELL ["conda", "run", "-n", "cci-toolbox", "/bin/bash", "-c"]

# Default to interactive shell
CMD ["bash"]
