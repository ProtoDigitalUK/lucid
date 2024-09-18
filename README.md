![Lucid CMS](https://github.com/ProtoDigitalUK/lucid/blob/master/banner.png?raw=true)

[![Tests](https://github.com/ProtoDigitalUK/lucid/actions/workflows/tests.yml/badge.svg)](https://github.com/ProtoDigitalUK/lucid/actions/workflows/tests.yml)
[![NPM Version](https://img.shields.io/npm/v/@lucidcms/core/latest.svg)](https://www.npmjs.com/package/@lucidcms/core)
![NPM Downloads](https://img.shields.io/npm/dw/@lucidcms/core)
![NPM License](https://img.shields.io/npm/l/@lucidcms/core)

<hr/>

> [!CAUTION]
> Lucid is still in Alpha and under heavy development, so please for the time being avoid using in any production setting. There is currently no commitment to backwards compatibility and breaking changes will be released on a regular basis while APIs and interfaces are being finalised.

> [!NOTE]  
> The development of Lucid over the next few months will reduced while we focus on building out a new related internal project. Critical issues will still be addressed promptly. Stay tuned for more details on the new project.

<hr/>

A TypeScript-first, fully extensible headless CMS. Constructed using Fastify and SolidJS, it features sophisticated collection and brick builders, a wide range of plugins, and database adapters for PostgreSQL, LibSQL, and SQLite. It achieves the perfect balance of developer experience and an intuitive, easy-to-use interface for creators and end-users alike, without compromising on performance and flexibility.

Effortlessly configure Lucid to meet your content needs with our flexible configuration options, and an array of first-party plugins including LocalStorage, Resend, Nodemailer, S3, and more.

## ✨ Features

- **Multiple Database Supported:** Choose between PostgreSQL, LibSQL, and SQLite database adapters.
- **Collection Builder:** Set collections to single or multiple document mode, toggle translation support, add fixed and dynamic bricks, and use any of the 13 custom fields to structure the collections to meet your content needs.
- **Brick Builder:** Define groups of custom fields that can be used within collections as either fixed or dynamic bricks. With access to 15 unique custom fiels, have the flexibility to create the content you want.
- **Media Library:** Upload and manage images, videos, audio, and documents, and use them throughout your content via the media custom field.
- **Extensible Email Support:** Define custom strategies for how Lucid should handle sending emails, use the exported sendEmail service to extend Lucid, update and create new templates, and view all sent emails from the emails list route.
- **Image Processing:** Use the CDN route to resize and reformat images on request, with support for next-gen formats like AVIF and WebP.
- **Users and Roles:** Invite as many users as you like and assign them roles with comprehensive permissions.
- **Full Localisation Support:** Full localisation support out of the box for collections and media with opt-in/out flags against individual fields.
- **Plugin Support:** Use plugins to to extend Lucid with a range of first party and third party solutions.
- **Hook Support:** Extend Lucid further through a range of hooks, giving you full flexibility to add custom features.
- **Client Integrations:** Register and manage client integrations allowing a head to request data from Lucid.
- **Toolkit:** Call client route services programmatically enabling you to extend Lucid.

## 🛠️ First Party Plugins

- **[Pages](https://github.com/ProtoDigitalUK/lucid/tree/master/packages/plugin-pages):** Adds nested document support to your collections along with slugs and computed fullSlugs based parent relationships.
- **[Nodemailer](https://github.com/ProtoDigitalUK/lucid/tree/master/packages/plugin-nodemailer):** Extend the email strategy to support Nodemailer by passing down a custom transport.
- **[S3](https://github.com/ProtoDigitalUK/lucid/tree/master/packages/plugin-s3):** Extend the media strategy to support using any S3 compatible storage solution.
- **[Local Storage](https://github.com/ProtoDigitalUK/lucid/tree/master/packages/plugin-local-storage):** Extends the media strategy to support uploading media to your file system.
- **Menus:** Coming soon!
- **Resend:** Coming soon!
- **Form Builder:** Coming soon!

## 🏁 Getting Started

To get started you can follow the [Getting Started](https://lucidcms.io/getting-started/) guide from our documentation. Lucid is super easy to get up and running and with the SQLite DB adapter along with the [Local Storage](https://lucidcms.io/plugins/local-storage/) plugin, you can get set up without needing any third party services.

## 🖥️ Lucid UI

Still under development, Lucid UI is an Astro and TailwindCSS based UI library that is built to be used with Lucid. It's not quite ready for prime time yet, but you can expect to see it launch along side the Lucid beta in the coming months.