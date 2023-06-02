import CollectionBuilder from "@lucid/collection-builder";

export const pages = new CollectionBuilder("page", {
  config: {
    type: "multiple",
    title: "Pages",
    singular: "Page",
    description: "Pages are used to create static content on your website.",
    bricks: ["banner", "intro"],
  },
});

export const settings = new CollectionBuilder("settings", {
  config: {
    type: "single",
    title: "Settings",
    singular: "Setting",
    description: "Settings are used to configure your website.",
    bricks: ["default_meta"],
  },
});
