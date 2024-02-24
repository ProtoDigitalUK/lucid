![Proto Headless CMS](https://github.com/ProtoDigitalUK/proto_headless/blob/master/banner.png?raw=true)

## Installation

```bash
npm install @protodigital/headless
```

## Builders

- [Brick Builder]()
- [Collection Builder]()

## headless.config.ts/js

```ts
import { headlessConfig } from "@protodigital/headless";
import { Banner, Intro, Meta } from "./src/bricks";
import { Pages, Blogs, Settings } from "./src/collections";

export default headlessConfig({
    mode: "development",
    host: "http://localhost:8393",
    databaseURL: process.env.DATABASE_URL as string,
    keys: {
        cookieSecret: process.env.HEADLESS_COOKIE_SECRET as string,
        refreshTokenSecret: process.env.HEADLESS_REFRESH_TOKEN_SECRET as string,
        accessTokenSecret: process.env.HEADLESS_ACCESS_TOKEN_SECRET as string,
    },
    email: {
        from: {
            email: "admin@protoheadless.com",
            name: "Proto Headless",
        },
        strategy: async (email, meta) => {},
    },
    media: {
        store: {
            service: "cloudflare",
            cloudflareAccountId: process.env.HEADLESS_CLOUDFLARE_ACCOUNT_ID,
            region: process.env.HEADLESS_S3_REGION as string,
            bucket: process.env.HEADLESS_S3_BUCKET as string,
            accessKeyId: process.env.HEADLESS_S3_ACCESS_KEY as string,
            secretAccessKey: process.env.HEADLESS_S3_SECRET_KEY as string,
        },
    },
    collections: [Pages, Blogs, Settings],
    bricks: [Banner, Intro, Meta]
});
```

> Check the example app: [example](https://github.com/ProtoDigitalUK/proto_headless/tree/master/apps/headless-example/headless.config.ts)

## Notes

- If you're using Supabase for your database, ensure you're using the session mode.
