FROM ubuntu:18.04
RUN apt-get update \
  && apt-get install -y --no-install-recommends mmv zip \
  && rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["/bin/bash"]
