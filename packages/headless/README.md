# @protoheadless/headless

> Notes and documentation for building and maintaining the headless package.

The core of Proto Digital Headless. This package is responsbile for exporting a Fastify plugin which spins up an API which handles internal and public requests, serves the SolidJS CMS and static assets.

## Dev Notes

- Response and Request data should all be in `snake_case`, but internally variables should be `camelCase`.
