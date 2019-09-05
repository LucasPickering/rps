# Rock Paper Scissors

## Development

### Setup

```
docker-compose up
./managepy.sh migrate
./managepy.sh loaddata init.json
```

This will pre-load some initial data to make development easier. There are three default users: `user1`, `user2`, and `user3`. The password for all three is `rockpaper`.

If you want to add more users, you can do so in the Django Admin UI (`/api/admin/`).

## Deployment

### Building & Pushing Images

Deployed via [Keskne](https://github.com/LucasPickering/keskne). Images are automatically built and pushed on every push to master.

## Notes

### React

#### Directory Structure

Files are first broken out by type. Within `components/`, files are meant to mirror the route structure.

#### Component names

| Suffix | Meaning                                           |
| ------ | ------------------------------------------------- |
| View   | High-level component rendered directly by a route |
