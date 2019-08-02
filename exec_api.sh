#!/bin/sh

CMD=${@-sh}
docker exec -it rps_api_1 ${CMD}
