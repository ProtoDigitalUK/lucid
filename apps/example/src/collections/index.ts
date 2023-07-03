import CollectionBuilder from "@lucid/collection-builder";

export const pages = new CollectionBuilder("page", {
  config: {
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
  },
});

export const settings = new CollectionBuilder("settings", {
  config: {
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
  },
});
