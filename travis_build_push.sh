#!/bin/sh
# Travis script
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
./build_push.sh api
./build_push.sh static

