import { CollectionBuilder } from "@lucid/core";

export const PageCollection = new CollectionBuilder("page", {
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

export const BlogCollection = new CollectionBuilder("blog", {
  type: "pages",
  title: "Blogs",
  singular: "Blog",
  path: "/blog",
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

export const SettingsCollection = new CollectionBuilder("settings", {
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
