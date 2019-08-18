# Rock Paper Scissors (Lizard Spock)

## Development

### Setup

```
docker-compose up
./exec_api.sh ./manage.py migrate
./exec_api.sh ./manage.py createsuperuser
```

## Deployment

### Building & Pushing Images

Deployed via [Keskne](https://github.com/LucasPickering/keskne).

```sh
docker login
# The static image depends on the API image, so we have to do this in order
./build_push.sh api
./build_push.sh static
```
