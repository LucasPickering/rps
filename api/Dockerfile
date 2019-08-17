FROM python:3-alpine

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

CMD ["sh", "-c", "dockerize -wait tcp://${RPS_DB_HOST}:5432 && ./manage.py migrate && gunicorn rps.wsgi -b :8000 --log-file /var/log/gunicorn/gunicorn.log --access-logfile /var/log/gunicorn/gunicorn_access.log"]
