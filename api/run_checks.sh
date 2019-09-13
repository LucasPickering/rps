#!/bin/sh
set -e

dockerize -wait tcp://db:5432
./manage.py makemigrations --dry-run --check
./manage.py test
