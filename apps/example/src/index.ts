import lucid, { BrickBuilder } from "@lucid/core";

// ----------------------------------------------
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

// ----------------------------------------------
// Start Lucid
lucid({
  port: 8393,
  origin: "*",
  environment: "development",
  secretKey: "f3b2e4b00b1a4b1e9b0a8b0a9b1e0b1a",
  postTypes: [
    {
      key: "blog",
      name: "Blogs",
      singularName: "Blog",
    },
  ],
  bricks: [bannerBrick, introBrick],
});
