import { ConfigT } from "./src/services/Config";
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
    validate: (value) => {
      const v = value as string;
      if (v.length > 10) {
        return "Title must be less than 10 characters";
      }
      return "";
    },
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
  environment: "development",
  secretKey: process.env.SECRET_KEY as string,
  collections: [pageCollection, settingsCollection],
  bricks: [bannerBrick, introBrick, defaultMetaBrick],
};

export default config;
