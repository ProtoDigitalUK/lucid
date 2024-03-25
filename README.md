![Proto Headless CMS](https://github.com/ProtoDigitalUK/proto_headless/blob/master/banner.png?raw=true)

> [!CAUTION]
> Under heavy construction!

## Installation

```bash
npm install @protodigital/headless
```

## Builders

- [Brick Builder]()
- [Collection Builder]()

## headless.config.ts/js

```ts
import { headlessConfig, LibsqlAdapter } from "@protodigital/headless";
// Plugins
import EmailResend from "@protodigital/plugin-email-resend";
import LocalStorage from "@protodigital/plugin-local-storage";
import FormBuilder from "@protodigital/plugin-form-builder";
import CookieConsentRecord from "@protodigital/plugin-cookie-consent";
// Collections
import PageCollection from "./src/headless/collections/pages.js";
import BlogCollection from "./src/headless/collections/blogs.js";
import SettingsCollection from "./src/headless/collections/settings.js";
import FormsCollection from "./src/headless/collections/forms.js";

export default headlessConfig({
  db: new LibsqlAdapter({
    url: "libsql://localhost:8080?tls=0",
  }),
  host: "http://localhost:8393",
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
    EmailResend({}),
    LocalStorage({}),
    FormBuilder,
    CookieConsentRecord,
  ],
});
```

> [!NOTE]
> The above isnt fully implemented, but is the direction for v1.

## Notes

- If you're using Supabase for your database, ensure you're using the session mode.
