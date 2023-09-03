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

import { ContactForm } from "./src/forms";
import { Banner, Intro, DefaultMeta } from "./src/bricks";
import { Pages, Settings } from "./src/collections";

export default buildConfig({
  host: "http://localhost:8393",
  origin: "*",
  mode: "development",
  secret: process.env.LUCID_SECRET_KEY as string,
  postgresURL: process.env.LUCID_POSTGRES_URL as string,
  email: {
    from: {
      name: "Lucid CMS",
      email: "hello@lucidcms.com",
    },
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
    maxFileSize: 20777216,
    fallbackImage: "https://picsum.photos/600/400", // false to throw 404, undefined for default and URL string for custom
    processedImageLimit: 5, // the total number of processed images to store per image
    store: {
      service: "cloudflare",
      cloudflareAccountId: process.env.LUCID_CLOUDFLARE_ACCOUNT_ID as string,
      region: process.env.LUCID_S3_REGION as string,
      bucket: process.env.LUCID_S3_BUCKET as string,
      accessKeyId: process.env.LUCID_S3_ACCESS_KEY as string,
      secretAccessKey: process.env.LUCID_S3_SECRET_KEY as string,
    },
  },
  forms: [ContactForm],
  collections: [Pages, Settings],
  bricks: [Banner, Intro, DefaultMeta],
});
```

> Check the example app: [example](https://github.com/WillYallop/Lucid/tree/master/apps/example/lucid.config.ts)
