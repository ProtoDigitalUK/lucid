# Lucid - S3 Plugin

> The official S3 plugin for Lucid

This plugin registers the required media strategy functions to stream, upload, update and delete media from any S3 compatible storage solution.

## Installation

```bash
npm install @lucidcms/plugin-s3
```

## lucid.config.ts/js

```typescript
import LucidS3 from "@lucidcms/plugin-s3";

export default lucidConfig({
  // ...other config
  plugins: [
    LucidS3({
      clientConfig: {
        endpoint: `https://${process.env.HEADLESS_CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        region: "auto",
        credentials: {
          accessKeyId: process.env.HEADLESS_S3_ACCESS_KEY as string,
          secretAccessKey: process.env.HEADLESS_S3_SECRET_KEY as string,
        },
      },
      bucket: "headless-cms",
    }),
  ],
});
```
