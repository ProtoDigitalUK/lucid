require("dotenv").config();
import { buildConfig } from "@lucid/core";
import { BannerBrick, IntroBrick, DefaultMetaBrick } from "./src/bricks";
import { PageCollection, SettingsCollection } from "./src/collections";
import { ContactForm } from "./src/forms";
import path from "path";

export default buildConfig({
  host: "http://localhost:8393",
  origin: "http://localhost:3000",
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
    maxFileSize: 20777216,
    fallbackImage: undefined,
    store: {
      service: "cloudflare",
      cloudflareAccountId: process.env.LUCID_CLOUDFLARE_ACCOUNT_ID,
      region: process.env.LUCID_S3_REGION as string,
      bucket: process.env.LUCID_S3_BUCKET as string,
      accessKeyId: process.env.LUCID_S3_ACCESS_KEY as string,
      secretAccessKey: process.env.LUCID_S3_SECRET_KEY as string,
    },
  },
  forms: [ContactForm],
  collections: [PageCollection, SettingsCollection],
  bricks: [BannerBrick, IntroBrick, DefaultMetaBrick],
});
