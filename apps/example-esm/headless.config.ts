import { buildConfig } from "@headless/core";
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
  host: process.env.HEADLESS_HOST as string,
  origin: process.env.HEADLESS_ORIGIN as string,
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
    fallbackImage: undefined,
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
  collections: [PageCollection, SettingsCollection, BlogCollection],
  bricks: [
    BannerBrick,
    IntroBrick,
    DefaultMetaBrick,
    TestingBrick,
    PageMetaBrick,
  ],
});
