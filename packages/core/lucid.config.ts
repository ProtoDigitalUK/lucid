import { buildConfig, BrickBuilder, CollectionBuilder } from "./src/index";
import z from "zod";
import { ContactForm } from "./src/dev";

// ------------------------------------
// Define Bricks
const BannerBrick = new BrickBuilder("banner", {
  preview: {
    mode: "image",
    image: {
      url: "/api/public/rumham.jpg",
    },
  },
})
  .addTab({
    key: "content_tab",
  })
  .addText({
    key: "title",
    description: "The title of the banner",
    default: "Banner Title",
    placeholder: "Enter a title",
    validation: {
      required: true,
      zod: z.string().min(3).max(100),
    },
  })
  .addMedia({
    key: "image",
    description: "The image for the banner",
    validation: {
      required: true,
      extensions: ["jpg", "png", "gif"],
      width: {
        min: 100,
        max: 500,
      },
      height: {
        min: 100,
        max: 500,
      },
    },
  })
  .addLink({
    key: "link",
  })
  .addPageLink({
    key: "page_link",
  })
  .addColour({
    key: "colour",
  })
  .addDateTime({
    key: "date",
  })
  .addWysiwyg({
    key: "intro",
  })
  .addRepeater({
    key: "social_links",
  })
  .addText({
    key: "social_title",
  })
  .addText({
    key: "social_url",
  })
  .endRepeater()
  .addTab({
    key: "config_tab",
  })
  .addCheckbox({
    key: "fullwidth",
    description: "Make the banner fullwidth",
    default: true,
  });

const IntroBrick = new BrickBuilder("intro")
  .addTab({
    key: "content_tab",
  })
  .addText({
    key: "title",
  })
  .addWysiwyg({
    key: "intro",
  });

const DefaultMetaBrick = new BrickBuilder("default_meta")
  .addText({
    key: "meta_title",
    title: "Meta Title",
  })
  .addText({
    key: "meta_description",
    title: "Meta Description",
  });

// ------------------------------------
// Define Collections
const PageCollection = new CollectionBuilder("page", {
  type: "pages",
  title: "Pages",
  singular: "Page",
  description: "Pages are used to create static content on your website.",
  bricks: [
    {
      key: "banner",
      type: "builder",
    },
    {
      key: "intro",
      type: "builder",
    },
    {
      key: "default_meta",
      type: "fixed",
      position: "bottom",
    },
  ],
});

const SettingsCollection = new CollectionBuilder("settings", {
  type: "singlepage",
  title: "Settings",
  singular: "Setting",
  description: "Settings are used to configure your website.",
  bricks: [
    {
      key: "default_meta",
      type: "fixed",
      position: "standard",
    },
  ],
});

// ------------------------------------
// Define Forms

// ------------------------------------
// Build Config
export default buildConfig({
  host: "http://localhost:3000",
  origin: "http://localhost:3000",
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
  collections: [PageCollection, SettingsCollection],
  bricks: [BannerBrick, IntroBrick, DefaultMetaBrick],
});
