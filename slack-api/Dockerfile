# Wheels don't work on alpine which makes builds super slow, so we use debian
# https://discuss.python.org/t/wheels-for-musl-alpine/7084
FROM python:3.9.5-slim

ENV PYTHONUNBUFFERED=1

RUN apt-get update && \
    apt-get install -y \
    gcc \
    libmagic-dev \
    libffi-dev \
    openssl \
    libpq-dev \
    && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app/api/

RUN pip install poetry
ADD pyproject.toml poetry.lock ./
RUN poetry install

COPY . .

ENTRYPOINT ["poetry", "run"]
