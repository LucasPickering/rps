#!/bin/sh

crond
./manage.py migrate
daphne rps.asgi:application -b 0.0.0.0 -p 8000 --access-log ${RPS_LOGGING_DIR-.}/daphne_access.log
