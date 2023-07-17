import { CollectionBuilder } from "@lucid/core";

export const Pages = new CollectionBuilder("page", {
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

export const Settings = new CollectionBuilder("settings", {
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
