![Proto Headless CMS](https://github.com/ProtoDigitalUK/proto_headless/blob/master/banner.png?raw=true)

> [!CAUTION]
> Under heavy construction!

## Installation

```bash
npm install @protoheadless/core
```

## Builders

- [Brick Builder]()
- [Collection Builder]()

## Plugins

- [Forms]()
- [Nested Documents]()
- [Cookie Consent]()
- [Resend]()
- [Nodemailer]()
- [S3](https://github.com/ProtoDigitalUK/proto_headless/tree/master/packages/plugin-s3)
- [Local Storage]()

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
