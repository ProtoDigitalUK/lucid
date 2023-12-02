![Proto Headless CMS](https://github.com/ProtoDigitalUK/proto_headless/blob/master/banner.png?raw=true)

## Installation

```bash
npm install @protodigital/headless
```

## Builders

- [Brick Builder]()
- [Collection Builder]()
- [Form Builder]()

## headless.config.ts/js

```ts
import { buildConfig } from "@protodigital/headless";

import { ContactForm } from "./src/forms";
import { Banner, Intro, DefaultMeta } from "./src/bricks";
import { Pages, Settings } from "./src/collections";

export default buildConfig({
  host: "http://localhost:8393",
  origin: "*",
  mode: "development",
  postgresURL: process.env.HEADLESS_POSTGRES_URL as string,
  secret: process.env.HEADLESS_SECRET_KEY as string,
  email: {
    from: {
      name: "Headless CMS",
      email: "hello@headlesscms.com",
    },
    templateDir: path.join(
      dirname(fileURLToPath(import.meta.url)),
      "./templates"
    ),
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
      cloudflareAccountId: process.env.HEADLESS_CLOUDFLARE_ACCOUNT_ID,
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

> Check the example app: [example](https://github.com/ProtoDigitalUK/proto_headless/tree/master/apps/example-esm/headless.config.ts)
