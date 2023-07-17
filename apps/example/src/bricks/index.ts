import { BrickBuilder } from "@lucid/core";

export const Banner = new BrickBuilder("banner")
  .addTab({
    key: "content_tab",
  })
  .addText({
    key: "title",
    description: "The title of the banner",
    validation: {
      required: true,
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

export const Intro = new BrickBuilder("intro")
  .addTab({
    key: "content_tab",
  })
  .addText({
    key: "title",
  })
  .addWysiwyg({
    key: "intro",
  });

export const DefaultMeta = new BrickBuilder("default_meta")
  .addText({
    key: "meta_title",
    title: "Meta Title",
  })
  .addText({
    key: "meta_description",
    title: "Meta Description",
  });
