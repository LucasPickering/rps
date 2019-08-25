#!/bin/sh

echo "Reading DB password from $RPS_DB_PASSWORD_FILE"
export RPS_DB_PASSWORD=$(cat $RPS_DB_PASSWORD_FILE)
echo "Reading secret key from $RPS_SECRET_KEY_FILE"
export RPS_SECRET_KEY=$(cat $RPS_SECRET_KEY_FILE)
