![Lucid CMS](https://github.com/ProtoDigitalUK/lucid/blob/master/banner.jpg?raw=true)

[![NPM Version](https://img.shields.io/npm/v/@lucidcms/core/latest.svg)](https://www.npmjs.com/package/@lucidcms/core)
[![Tests](https://github.com/ProtoDigitalUK/lucid/actions/workflows/tests.yml/badge.svg)](https://github.com/ProtoDigitalUK/lucid/actions/workflows/tests.yml)

<hr/>

> ❗ Lucid is still in Alpha and under heavy development so please avoid using this in any production setting.

<hr/>

A TypeScript-first, fully extensible headless CMS. Constructed using Fastify and SolidJS, it features sophisticated collection and brick builders, a wide range of plugins, and database adapters for PostgreSQL, LibSQL, and SQLite. It achieves the perfect balance of developer experience and an intuitive, easy-to-use interface for creators and end-users alike, without compromising on performance and flexibility.

Effortlessly configure Lucid to meet your content needs with our flexible configuration options, and an array of first-party plugins including LocalStorage, Resend, Nodemailer, S3, and more.

## Features

- **Modern:** Powered by Fastify and SolidJS, rest assured this modern headless CMS will remain snappy while scaling to your content needs.
- **Multiple Database Support:** Choose between PostgreSQL, LibSQL, and SQLite database adapters.
- **Collection Builder:** Collections allow you to define types of data and have access to 13 unique custom fields.
- **Brick Builder:** Bricks allow you to define groups of custom fields and have access to 15 unique custom fields.
- **Media Library:** Upload and manage images, videos, audio, and documents and use them in your content via the media custom field.
- **Extensible Email Support:** Define custom strategies for how Lucid should handle sending emails, use the exported sendEmail service in extend Lucid and view all sent emails from the emails list route.
- **Image Processing:** Use the CDN route to resize and re-format images on request with support for next-gen formats like AVIF and WebP.
- **Users and Roles:** Invite as many users as you like, and assign roles against them with comprehensive permissions.
- **Full Localisation Support:** Full localisation support out of the box for collections and media with opt-in flags against individual fields.
- **Plugin Support:** Extend the Lucid config with full plugin support from the get-go.
- **Hook Support:** Execute custom code through various hooks and extend Lucid to reach your requirements.

## First Party Plugins

- **[Nodemailer](https://github.com/ProtoDigitalUK/lucid/tree/master/packages/plugin-nodemailer):** Extend the email strategy to support Nodemailer by passing down a custom transport.
- **[S3](https://github.com/ProtoDigitalUK/lucid/tree/master/packages/plugin-s3):** Extend the media strategy to support using any S3 compatible storage solution.
- **[Local Storage](https://github.com/ProtoDigitalUK/lucid/tree/master/packages/plugin-local-storage):** Extends the media strategy to support uploading media to your file system.

## Getting Started

To get started you can follow the [Getting Started](https://lucidcms.io/getting-started/) guide from our documentation. Lucid is super easy to get up and running and with the SQLite DB adapter along with the [Local Storage](https://lucidcms.io/plugins/local-storage/) plugin, you can get set up without needing any third party services.
