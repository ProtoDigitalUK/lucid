# @protodigital/headless

> Notes and documentation for building and maintaining the headless package.

The core of Proto Digital Headless. This package is responsbile for exporting a Fastify plugin which spins up an API which handles internal and public requests, serves the SolidJS CMS and static assets.

## Database & Migrations

Migrations are written manually and stored in the `src/db/migrations` directory. When the application is started, the migrations are run automatically. The filename of the migration files should be prefixed with an 8 digit number, followed by a hyphen, and then a short description of the migration. For example, `00000001-init-migrations.sql`. The prefixed number is used to determine the order in which the migrations are run and as such should be incremented sequentially.

## Dev Notes

- Response and Request data should all be in `snake_case`, but internally variables should be `camelCase`.