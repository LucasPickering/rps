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

### Running Tests

```
./managepy.sh test
cd webapp && npm run test
```

### Updating Fixture

If you do a migration or want to add more data to the dev DB, you should update the fixture with:

```
./managepy.sh dumpdata auth core > api/core/fixtures/init.json
```

### Setup Google Auth

- `cp .env.example .env`
- [Go here](https://console.developers.google.com/apis/credentials)
- Select OAuth client ID
  - Select Web application
  - Name: Literally anything
  - Authorized origins: `https://localhost:3000` (or whatever host you develop on)
  - Redirect URIs: `https://localhost:3000/account/login/redirect`
- Copy the client key and secret into `.env`

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
