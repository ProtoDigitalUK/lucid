# @lucid/core

> Notes and documentation for building and maintaining the core package.

## Database & Migrations

Migrations are written manually and stored in the `src/db/migrations` directory. When the application is started, the migrations are run automatically. The filename of the migration files should be prefixed with an 8 digit number, followed by a hyphen, and then a short description of the migration. For example, `00000001-init-migrations.sql`. The prefixed number is used to determine the order in which the migrations are run and as such should be incremented sequentially.
