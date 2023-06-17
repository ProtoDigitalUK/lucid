import z from "zod";
import { ConfigT } from "./src/db/models/Config";
import BrickBuilder from "@lucid/brick-builder";
import CollectionBuilder from "@lucid/collection-builder";

// ------------------------------------
// Define Bricks
const bannerBrick = new BrickBuilder("banner")
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
    validation: {
      max: 5,
    },
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

const introBrick = new BrickBuilder("intro")
  .addTab({
    key: "content_tab",
  })
  .addText({
    key: "title",
  })
  .addWysiwyg({
    key: "intro",
  });

const defaultMetaBrick = new BrickBuilder("default_meta")
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
const pageCollection = new CollectionBuilder("page", {
  config: {
    type: "pages",
    title: "Pages",
    singular: "Page",
    description: "Pages are used to create static content on your website.",
    bricks: ["banner", "intro"],
  },
});

const settingsCollection = new CollectionBuilder("settings", {
  config: {
    type: "group",
    title: "Settings",
    singular: "Setting",
    description: "Settings are used to configure your website.",
    bricks: ["default_meta"],
  },
});

const config: ConfigT = {
  databaseUrl: process.env.LUCID_database_url as string,
  port: 8393,
  origin: "*",
  mode: "development",
  secretKey: process.env.SECRET_KEY as string,
  environments: [
    // {
    //   title: "Site Prod",
    //   key: "site_prod",
    // },
    // {
    //   title: "Site Stage",
    //   key: "site_stage",
    // },
  ],
  collections: [pageCollection, settingsCollection],
  bricks: [bannerBrick, introBrick, defaultMetaBrick],
};

export default config;
