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

- Follow [these steps](https://django-allauth.readthedocs.io/en/latest/providers.html#google) to set up your OAuth client
  - For the authorized origin, use `https://localhost:3000`
  - For the callback URI, use `https://localhost:3000/account/login/redirect/google`
  - If you develop on non-`localhost`, you'll have to make a hosts file rule for a bogus domain name, and use that.
- To expose the client ID to the browser:
  - `cp .env.example .env`
  - If you're not using localhost, change the value for `RPS_HOSTNAME`
  - Set `RPS_GOOGLE_CLIENT_ID` to the client ID from Google

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
