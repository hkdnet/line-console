FROM node:7.1.0

RUN mkdir /app
WORKDIR /app

# entrykit
RUN mkdir tmp && \
    cd tmp && \
    wget https://github.com/progrium/entrykit/releases/download/v0.4.0/entrykit_0.4.0_Linux_x86_64.tgz && \
    tar zxvf entrykit_0.4.0_Linux_x86_64.tgz && \
    cp entrykit /bin/ && \
    /bin/entrykit --symlink && \
    cd ../ && \
    rm -rf tmp

ENTRYPOINT [ \
  "prehook", "npm install", "--", \
  "switch", \
    "shell=/bin/bash", \
    "version=node -v", \
    "--", \
  "npm", "start" \
]
