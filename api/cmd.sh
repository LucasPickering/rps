#!/bin/sh

echo "Reading DB password from $RPS_DB_PASSWORD_FILE"
export RPS_DB_PASSWORD=$(cat $RPS_DB_PASSWORD_FILE)
echo "Reading secret key from $RPS_SECRET_KEY_FILE"
export RPS_SECRET_KEY=$(cat $RPS_SECRET_KEY_FILE)
dockerize -wait tcp://${RPS_DB_HOST}:5432
./manage.py migrate
daphne rps.asgi:application -b 0.0.0.0 -p 8000 --access-log ${RPS_LOGGING_DIR}/daphne_access.log
