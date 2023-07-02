# Lucid Headless CMS

> IN ACTIVE DEVELOPMENT

- [BrickBuilder](https://github.com/WillYallop/Lucid/tree/master/packages/brick-builder)
- [CollectionBuilder](https://github.com/WillYallop/Lucid/tree/master/packages/collection-builder)
- [Core](https://github.com/WillYallop/Lucid/tree/master/packages/core)

## Installation

```bash
npm install @lucid/core @lucid/brick-builder @lucid/collection-builder
```

## lucid.config.ts/js

```ts
import { type Config } from "@lucid/core";
import { banner, intro, defaultMeta } from "./src/bricks";
import { pages, settings } from "./src/collections";

const config: Config = {
  databaseUrl: process.env.LUCID_database_url as string,
  port: 8393,
  origin: "*",
  mode: "development",
  secretKey: process.env.LUCID_SECRET_KEY as string,
  environments: [
    {
      title: "Site Production",
      key: "site_prod",
    },
    {
      title: "Site Staging",
      key: "site_stage",
    },
  ],
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
};

export default config;
```

> Check the example app: [example](https://github.com/WillYallop/Lucid/tree/master/apps/example/lucid.config.ts)

## Logging In

After starting the server, you can login by going to `/login`. Use the following credentials:

```
username: admin
password: admin
```

After logging in for the first time, you will be prompted to change your password, email and optionally your username.
