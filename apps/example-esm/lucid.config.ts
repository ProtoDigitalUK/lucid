import { buildConfig } from "@lucid/core";
import {
  BannerBrick,
  IntroBrick,
  DefaultMetaBrick,
  TestingBrick,
  PageMetaBrick,
} from "./src/bricks/index.js";
import {
  PageCollection,
  SettingsCollection,
  BlogCollection,
} from "./src/collections/index.js";
import { ContactForm } from "./src/forms/index.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

export default buildConfig({
  host: process.env.LUCID_HOST as string,
  origin: process.env.LUCID_ORIGIN as string,
  mode: "development",
  postgresURL: process.env.LUCID_POSTGRES_URL as string,
  secret: process.env.LUCID_SECRET_KEY as string,
  email: {
    from: {
      name: "Lucid CMS",
      email: "hello@lucidcms.com",
    },
    templateDir: path.join(
      dirname(fileURLToPath(import.meta.url)),
      "./templates"
    ),
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
  collections: [PageCollection, SettingsCollection, BlogCollection],
  bricks: [
    BannerBrick,
    IntroBrick,
    DefaultMetaBrick,
    TestingBrick,
    PageMetaBrick,
  ],
});
