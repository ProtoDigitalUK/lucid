![Proto Headless](https://github.com/ProtoDigitalUK/proto_headless/blob/master/banner.png?raw=true)

> [!CAUTION]
> Under heavy construction - Not suitable for production

Proto Headless is a blazingly fast, state-of-the-art headless CMS with top-tier TypeScript support. Constructed using Fastify and SolidJS, it features sophisticated collection and brick builders, a wide range of plugins, and database adapters for PostgreSQL, LibSQL, and SQLite. It achieves the perfect balance of developer experience and an intuitive, easy-to-use interface for creators and end-users alike, without compromising on performance and flexibility.

Effortlessly configure Proto Headless to meet your content needs with our flexible configuration options, and an array of first-party plugins including LocalStorage, Resend, Nodemailer, S3, and more.

## Installation

```bash
npm install @protoheadless/core
```

## First Party Plugins

- [Forms](https://github.com/ProtoDigitalUK/proto_headless/tree/master/packages/plugin-forms)
- [Nested Documents](https://github.com/ProtoDigitalUK/proto_headless/tree/master/packages/plugin-nested-documents)
- [Cookie Consent](https://github.com/ProtoDigitalUK/proto_headless/tree/master/packages/plugin-cookie-consent)
- [Resend](https://github.com/ProtoDigitalUK/proto_headless/tree/master/packages/plugin-resend)
- [Nodemailer](https://github.com/ProtoDigitalUK/proto_headless/tree/master/packages/plugin-nodemailer)
- [S3](https://github.com/ProtoDigitalUK/proto_headless/tree/master/packages/plugin-s3)
- [Local Storage](https://github.com/ProtoDigitalUK/proto_headless/tree/master/packages/plugin-local-storage)

## headless.config.ts/js

```ts
import headless, { LibsqlAdapter } from "@protoheadless/core";
// Plugins
import HeadlessNodemailer from "@protoheadless/plugin-nodemailer";
import HeadlessS3 from "@protoheadless/plugin-s3";
import HeadlessLocalStorage from "@protoheadless/plugin-local-storage";
// Collections
import PageCollection from "./src/headless/collections/pages.js";
import BlogCollection from "./src/headless/collections/blogs.js";
import SettingsCollection from "./src/headless/collections/settings.js";
import FormsCollection from "./src/headless/collections/forms.js";

export default headless.config({
  host: "http://localhost:8393",
  db: new LibsqlAdapter({
    url: "libsql://localhost:8080?tls=0",
  }),
  keys: {
    cookieSecret: process.env.HEADLESS_COOKIE_SECRET as string,
    refreshTokenSecret: process.env.HEADLESS_REFRESH_TOKEN_SECRET as string,
    accessTokenSecret: process.env.HEADLESS_ACCESS_TOKEN_SECRET as string,
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
    HeadlessNodemailer({
      from: {
        email: "admin@protoheadless.com",
        name: "Protoheadless",
      },
      transporter: transporter,
    }),
    HeadlessLocalStorage({
      uploadDir: "uploads",
    }),
  ],
});
```
