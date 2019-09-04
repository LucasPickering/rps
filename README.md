# Rock Paper Scissors

## Development

### Setup

```
docker-compose up
./managepy.sh migrate
./managepy.sh loaddata init.json
```

## Deployment

### Building & Pushing Images

Deployed via [Keskne](https://github.com/LucasPickering/keskne). Images are automatically built and pushed on every push to master.

## Notes

### React

#### Directory Structure

Files are first broken out by type. Within `components/`, files are meant to mirror the route structure.

#### Component names

| Suffix  | Meaning                                                |
| ------- | ------------------------------------------------------ |
| View    | High-level component rendered directly by a route      |
| Handler | Loads API data, then renders another component with it |
