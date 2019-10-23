# channels-redis has a mystical bug on python 3.8.0
FROM python:3.7-alpine

ENV PYTHONUNBUFFERED=1

RUN apk add --no-cache \
    gcc \
    libmagic \
    libffi-dev \
    linux-headers \
    musl-dev \
    openssl \
    postgresql-dev \
    zlib-dev

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /app/api/

COPY requirements.txt .
RUN pip install -U -r requirements.txt
COPY . .
RUN crontab docker/crontab

ENTRYPOINT ["./docker/entrypoint.sh"]
CMD ["./docker/cmd.sh"]
