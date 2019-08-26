#!/bin/sh

if [ ! -z ${RPS_DB_PASSWORD_FILE} ]; then
    echo "Reading DB password from $RPS_DB_PASSWORD_FILE"
    export RPS_DB_PASSWORD=$(cat $RPS_DB_PASSWORD_FILE)
fi
if [ ! -z ${RPS_SECRET_KEY_FILE} ]; then
    echo "Reading secret key from $RPS_SECRET_KEY_FILE"
    export RPS_SECRET_KEY=$(cat $RPS_SECRET_KEY_FILE)
fi
exec "$@"
