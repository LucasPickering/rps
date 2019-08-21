#!/bin/sh
set -e

docker-compose -f docker-compose.build.yml build --pull $@
docker-compose -f docker-compose.build.yml push $@
