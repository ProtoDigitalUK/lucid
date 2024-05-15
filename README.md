![Lucid](https://github.com/ProtoDigitalUK/lucid/blob/master/banner.jpg?raw=true)

> [!CAUTION]
> Under heavy construction - Not suitable for production

[![Tests](https://github.com/ProtoDigitalUK/lucid/actions/workflows/tests.yml/badge.svg)](https://github.com/ProtoDigitalUK/lucid/actions/workflows/tests.yml)

Lucid is a blazingly fast, state-of-the-art headless CMS with top-tier TypeScript support. Constructed using Fastify and SolidJS, it features sophisticated collection and brick builders, a wide range of plugins, and database adapters for PostgreSQL, LibSQL, and SQLite. It achieves the perfect balance of developer experience and an intuitive, easy-to-use interface for creators and end-users alike, without compromising on performance and flexibility.

Effortlessly configure Lucid to meet your content needs with our flexible configuration options, and an array of first-party plugins including LocalStorage, Resend, Nodemailer, S3, and more.

## Installation

```bash
npm install @lucidcms/core
```

## First Party Plugins

- [Forms](https://github.com/ProtoDigitalUK/lucid/tree/master/packages/plugin-forms)
- [Nested Documents](https://github.com/ProtoDigitalUK/lucid/tree/master/packages/plugin-nested-documents)
- [Cookie Consent](https://github.com/ProtoDigitalUK/lucid/tree/master/packages/plugin-cookie-consent)
- [Resend](https://github.com/ProtoDigitalUK/lucid/tree/master/packages/plugin-resend)
- [Nodemailer](https://github.com/ProtoDigitalUK/lucid/tree/master/packages/plugin-nodemailer)
- [S3](https://github.com/ProtoDigitalUK/lucid/tree/master/packages/plugin-s3)
- [Local Storage](https://github.com/ProtoDigitalUK/lucid/tree/master/packages/plugin-local-storage)

## lucid.config.ts/js

```ts
import lucid, { LibsqlAdapter } from "@lucidcms/core";
// Plugins
import LucidNodemailer from "@lucidcms/plugin-nodemailer";
import LucidS3 from "@lucidcms/plugin-s3";
import LucidLocalStorage from "@lucidcms/plugin-local-storage";
// Collections
import PageCollection from "./src/lucid/collections/pages.js";
import BlogCollection from "./src/lucid/collections/blogs.js";
import SettingsCollection from "./src/lucid/collections/settings.js";
import FormsCollection from "./src/lucid/collections/forms.js";

export default lucid.config({
  host: "http://localhost:8393",
  db: new LibsqlAdapter({
    url: "libsql://localhost:8080?tls=0",
  }),
  keys: {
    cookieSecret: process.env.LUCID_COOKIE_SECRET as string,
    refreshTokenSecret: process.env.LUCID_REFRESH_TOKEN_SECRET as string,
    accessTokenSecret: process.env.LUCID_ACCESS_TOKEN_SECRET as string,
  },
  localisation: {
    locales: [
      {
        label: "English",
        code: "en",
      },
      {
        label: "French",
        code: "fr",
      },
    ],
    defaultLocale: "en",
  },
  hooks: [
    {
      service: "collection-documents",
      event: "beforeUpsert",
      handler: async (props) => {},
    },
  ],
  collections: [
    PageCollection,
    BlogCollection,
    SettingsCollection,
    FormsCollection,
  ],
  plugins: [
    LucidNodemailer({
      from: {
        email: "admin@lucidcms.io",
        name: "Lucid",
      },
      transporter: transporter,
    }),
    LucidLocalStorage({
      uploadDir: "uploads",
    }),
  ],
});
```
