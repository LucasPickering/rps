#!/bin/sh
set -ex

flake8 **/*.py
black --check **/*.py
dockerize -wait tcp://db:5432
./manage.py makemigrations --dry-run --check
./manage.py test
