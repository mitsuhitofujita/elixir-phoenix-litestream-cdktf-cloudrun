FROM elixir:1.15.6

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends \
        curl \
        unzip \
        wget
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    node --version
RUN apt-get autoremove -y && \
    apt-get clean && \
	rm -rf /var/lib/apt/lists/*
ARG TERRAFORM_VERSION=1.6.2
RUN wget --progress=dot:mega https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip && \
	unzip terraform_${TERRAFORM_VERSION}_linux_amd64.zip && \
	mv terraform /usr/local/bin/ && \
	chmod +x /usr/local/bin/terraform && \
	terraform --version
ARG ELIXIR_GID=1000
ARG ELIXIR_GROUP=vscode
ARG ELIXIR_HOME=/home/vscode
ARG ELIXIR_UID=1000
ARG ELIXIR_USER=vscode
RUN groupadd -g ${ELIXIR_GID} ${ELIXIR_GROUP} && \
    useradd -g ${ELIXIR_GROUP} -u ${ELIXIR_UID} -d ${ELIXIR_HOME} -m ${ELIXIR_USER}
