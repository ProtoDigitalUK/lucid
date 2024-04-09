![Proto Headless CMS](https://github.com/ProtoDigitalUK/proto_headless/blob/master/banner.png?raw=true)

> [!CAUTION]
> Under heavy construction!

## Installation

```bash
npm install @protoheadless/headless
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
import { headlessConfig, LibsqlAdapter } from "@protoheadless/headless";

import NodemailerPlugin from "@protoheadless/plugin-nodemailer";
import LocalStoragePlugin from "@protoheadless/plugin-local-storage";
import FormsPlugin from "@protoheadless/plugin-forms";
import CookieConsentPlugin from "@protoheadless/plugin-cookie-consent";

import PageCollection from "./src/headless/collections/pages.js";
import BlogCollection from "./src/headless/collections/blogs.js";
import SettingsCollection from "./src/headless/collections/settings.js";
import FormsCollection from "./src/headless/collections/forms.js";

export default headlessConfig({
  host: "http://localhost:8393",
  db: new LibsqlAdapter({
    url: "libsql://localhost:8080?tls=0",
  }),
  keys: {
    cookieSecret: process.env.HEADLESS_COOKIE_SECRET as string,
    refreshTokenSecret: process.env.HEADLESS_REFRESH_TOKEN_SECRET as string,
    accessTokenSecret: process.env.HEADLESS_ACCESS_TOKEN_SECRET as string,
  },
  collections: [
    PageCollection,
    BlogCollection,
    SettingsCollection,
    FormsCollection,
  ],
  plugins: [
    NodemailerPlugin({
      from: {
        email: "admin@protoheadless.com",
        name: "Protoheadless",
      },
      transporter: transporter,
    }),
    LocalStoragePlugin({}),
    FormsPlugin,
    CookieConsentPlugin,
  ],
});
```
