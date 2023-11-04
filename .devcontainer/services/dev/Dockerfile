FROM elixir:1.15.6

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        unzip \
        wget && \
        install -m 0755 -d /etc/apt/keyrings
ENV NODE_MAJOR=18
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | \
        tee -a /etc/apt/sources.list.d/nodesource.list && \
    apt-get update -y && \
    apt-get install -y \
        nodejs && \
    node --version
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | \
        tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && \
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg add - && \
    apt-get update -y && \
    apt-get install -y \
        google-cloud-sdk && \
    gcloud --version
RUN apt-get autoremove -y && \
    apt-get clean && \
	rm -rf /var/lib/apt/lists/*
ARG TERRAFORM_VERSION=1.6.2
RUN wget --progress=dot:mega https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip && \
	unzip terraform_${TERRAFORM_VERSION}_linux_amd64.zip && \
	mv terraform /usr/local/bin/ && \
	chmod +x /usr/local/bin/terraform && \
	terraform --version
RUN npm install --global cdktf-cli@0.19.0
RUN wget -q -O /tmp/litestream.deb https://github.com/benbjohnson/litestream/releases/download/v0.3.13/litestream-v0.3.13-linux-amd64.deb && \
    dpkg -i  /tmp/litestream.deb && \
    rm  /tmp/litestream.deb
ARG DEV_GID=1000
ARG DEV_GROUP=vscode
ARG DEV_HOME=/home/vscode
ARG DEV_UID=1000
ARG DEV_USER=vscode
RUN groupadd -g ${DEV_GID} ${DEV_GROUP} && \
    useradd -g ${DEV_GROUP} -u ${DEV_UID} -d ${DEV_HOME} -m ${DEV_USER}
