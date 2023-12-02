![Headless, a Headless CMS](https://github.com/WillYallop/Headless/blob/master/banner.jpg?raw=true)

## Installation

```bash
npm install @headless/core
```

## Builders

- [Brick Builder](https://github.com/WillYallop/Headless/tree/master/packages/brick-builder)
- [Collection Builder](https://github.com/WillYallop/Headless/tree/master/packages/collection-builder)
- [Form Builder](https://github.com/WillYallop/Headless/tree/master/packages/form-builder)

## headless.config.ts/js

```ts
import { buildConfig } from "@headless/core";

import { ContactForm } from "./src/forms";
import { Banner, Intro, DefaultMeta } from "./src/bricks";
import { Pages, Settings } from "./src/collections";

export default buildConfig({
  host: "http://localhost:8393",
  origin: "*",
  mode: "development",
  secret: process.env.HEADLESS_SECRET_KEY as string,
  postgresURL: process.env.HEADLESS_POSTGRES_URL as string,
  email: {
    from: {
      name: "Headless CMS",
      email: "hello@headlesscms.com",
    },
    smtp: {
      host: "127.0.0.1",
      port: 6969,
      secure: false,
      user: process.env.HEADLESS_SMPT_USER as string,
      pass: process.env.HEADLESS_SMPT_PASS as string,
    },
  },
  media: {
    storageLimit: 5368709120,
    maxFileSize: 20777216,
    fallbackImage: "https://picsum.photos/600/400", // false to throw 404, undefined for default and URL string for custom
    processedImageLimit: 10, // the total number of processed images to store per image
    store: {
      service: "cloudflare",
      cloudflareAccountId: process.env.HEADLESS_CLOUDFLARE_ACCOUNT_ID as string,
      region: process.env.HEADLESS_S3_REGION as string,
      bucket: process.env.HEADLESS_S3_BUCKET as string,
      accessKeyId: process.env.HEADLESS_S3_ACCESS_KEY as string,
      secretAccessKey: process.env.HEADLESS_S3_SECRET_KEY as string,
    },
  },
  forms: [ContactForm],
  collections: [Pages, Settings],
  bricks: [Banner, Intro, DefaultMeta],
});
```

> Check the example app: [example](https://github.com/WillYallop/Headless/tree/master/apps/example/headless.config.ts)
