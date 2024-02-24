# Doperad

## Full-stack starter project built on NestJS and React

Doperad is a full-stack starter project containing a NestJS backend and a React frontend bootstrapped with Vite.

## Key features:

### Backend

* fully typed
* Prisma ORM + prostgresql backed DB
* Swagger UI (/swagger)
* comes prepared with an example "posts" data type and corresponding CRUD
* has auth and user support ready using JWTs, secured by being used as HTTPOnly SameSite Secure cookies (the JWTAuthGuard automatically extracts the user info contained in the JWT from the cookie)
* automatic paramater validation
* CORS support

### Frontend

* fully typed
* Vite based React setup
* uses the Mantine UI lib
* react-query and hooks for handling auth and the posts data type, examples with query invalidation, error handling etc
* react-error-boundary
* sign up and sign in forms
* form and display of the example posts data type

#### Other

* semantic-release to automatically handle releases, version bumping and changelog
* conventional commits with hooks to enforce it
* husky for git hooks

## Setup

By default Doperad is configured to run with Postgres. Make sure Postgres is installed and running on your system.

#### Backend

* Copy .env.sample to .env
* Adjust the database URL to match your environment
* Set a JWT secret
* Install packages: `yarn`
* Migrate DB: `npx prisma migrate deploy`
* Run in dev: `yarn start:dev`
* Run in production: `yarn build && yarn start:prod`

#### Frontend

* cd to `client`
* copy .env.sample to .env and adjust to proper API base (default unless changed)
* run `yarn`
* Run in dev: `yarn dev`
* Build for deployment: `yarn build`

## License

MIT