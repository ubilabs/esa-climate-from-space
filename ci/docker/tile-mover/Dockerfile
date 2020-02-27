FROM ubuntu:18.04
RUN apt-get update \
  && apt-get install -y --no-install-recommends mmv \
  && rm -rf /var/lib/apt/lists/*
ENTRYPOINT ["/bin/bash"]
