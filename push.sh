#!/bin/sh
# Travis script
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker-compose -f docker-compose.build.yml push
