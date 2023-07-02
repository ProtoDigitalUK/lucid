import { type Config } from "@lucid/core";
import { banner, intro, defaultMeta } from "./src/bricks";
import { pages, settings } from "./src/collections";

const config: Config = {
  databaseUrl: process.env.LUCID_database_url as string,
  port: 8393,
  origin: "*",
  mode: "development",
  secretKey: process.env.SECRET_KEY as string,
  environments: [
    {
      title: "Production",
      key: "production",
    },
    {
      title: "Staging",
      key: "staging",
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
