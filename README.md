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

```
docker login
docker-compose -f docker-compose.build.yml build
docker-compose -f docker-compose.build.yml push
```
