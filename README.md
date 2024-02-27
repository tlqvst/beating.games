# beating.games

beating.games is a beautiful way to organize your video game backlog.


## Local setup

### Requirements

Node 18 or higher

Prisma supported DB server (PostgreSQL, MySQL, SQL Server, SQLite, MongoDB and CockroachDB)

### Instructions

Clone the repo

```sh
## install dependencies
yarn # (--ignore-engines if using yarn 1.x)

## setup .env
cp .env.sample .env # adjust it accordingly

# run db migrations
npx prisma migrate deploy

# start server
yarn dev

# setup client
cd client

# setup .env
cp .env.sample .env # adjust it accordingly

# install dependencies
yarn

# start client server
yarn dev
```

### Generating API client for frontend

Interfaces, service methods and hooks are automatically generated from the OpenAPI specification provided by the API.

To regenerate after changes to the API, run `yarn generate-api`.