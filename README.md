# Lucid Headless CMS

> IN ACTIVE DEVELOPMENT

- [BrickBuilder](https://github.com/WillYallop/Lucid/tree/master/packages/brick-builder)
- [CollectionBuilder](https://github.com/WillYallop/Lucid/tree/master/packages/collection-builder)
- [FormBuilder](https://github.com/WillYallop/Lucid/tree/master/packages/form-builder)
- [Core](https://github.com/WillYallop/Lucid/tree/master/packages/core)

## Installation

```bash
npm install @lucid/core
```

## lucid.config.ts/js

```ts
import { buildConfig } from "@lucid/core";
import { banner, intro, defaultMeta } from "./src/bricks";
import { pages, settings } from "./src/collections";

export default buildConfig({
  origin: "*",
  mode: "development",
  postgresURL: process.env.LUCID_POSTGRES_URL as string,
  secret: process.env.LUCID_SECRET_KEY as string,
  email: {
    from: {
      name: "Lucid CMS",
      email: "hello@lucidcms.com",
    },
    templateDir: path.join(__dirname, "./templates"),
    smtp: {
      host: "127.0.0.1",
      port: 6969,
      secure: false,
      user: process.env.LUCID_SMPT_USER as string,
      pass: process.env.LUCID_SMPT_PASS as string,
    },
  },
  media: {
    storageLimit: 5368709120,
    maxFileSize: 16777216,
    store: {
      service: "cloudflare",
      cloudflareAccountId: process.env.LUCID_CLOUDFLARE_ACCOUNT_ID as string,
      region: process.env.LUCID_S3_REGION as string,
      bucket: process.env.LUCID_S3_BUCKET as string,
      accessKeyId: process.env.LUCID_S3_ACCESS_KEY as string,
      secretAccessKey: process.env.LUCID_S3_SECRET_KEY as string,
    },
  },
  collections: [pages, settings],
  bricks: [banner, intro, defaultMeta],
});
```

> Check the example app: [example](https://github.com/WillYallop/Lucid/tree/master/apps/example/lucid.config.ts)

## Logging In

After starting the server, you can login by going to `/login`. Use the following credentials:

```
username: admin
password: admin
```

When logging in for the first time, you will be prompted to change your password, email and optionally your username. The first two are required, but you can leave the username field blank to keep the default value.
