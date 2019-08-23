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

Deployed via [Keskne](https://github.com/LucasPickering/keskne). Images are automatically built and pushed on every push to master.

## Nomenclature

### React

#### Component names

| Suffix  | Meaning                                                |
| ------- | ------------------------------------------------------ |
| View    | High-level component rendered directly by a route      |
| Handler | Loads API data, then renders another component with it |
