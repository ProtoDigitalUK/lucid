# Lucid

> IN ACTIVE DEVELOPMENT

Lucid is an innovative headless content management system designed from the ground up for speed, security, and ease of use. Central to Lucid's philosophy is the component-based approach to building pages, introducing the concept of "bricks". These bricks form the building blocks of reusable, adaptable components that can be deployed across numerous pages, aiding developers in creating unique and dynamic content experiences.

At the heart of this component-based system lies the Lucid config, where you make use of the BrickBuilder class. This class allows you to define bricks equipped with a wide range of custom fields. From WYSIWYG editors to images and repeaters, BrickBuilder puts the power of customisation and reusability at your fingertips.

Along with the BrickBuilder, we have the CollectionBuilder. This class enables you to define collections of pages or groups in the CMS, with each collection able to include an approved set of bricks. These collections can be of a 'single' or 'multiple' type. Single collections represent standalone pages or groups, while multiple collections facilitate the creation of individual pages within a new section in the CMS. This addition opens up a whole new level of content structuring, providing developers with an even greater degree of customisation.

## Documentation

- [BrickBuilder](https://github.com/WillYallop/Lucid/tree/master/packages/brick-builder)
- [CollectionBuilder](https://github.com/WillYallop/Lucid/tree/master/packages/collection-builder)
- [Core](https://github.com/WillYallop/Lucid/tree/master/packages/core)

## Installation

```bash
npm install @lucid/core @lucid/brick-builder @lucid/collection-builder
```

## lucid.config.ts/js

```ts
import BrickBuilder from "@lucid/brick-builder";
import CollectionBuilder from "@lucid/collection-builder";
import { type Config } from "@lucid/core";

// ------------------------------------
// Bricks
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
// Collections
const pageCollection = new CollectionBuilder("page", {
  config: {
    type: "multiple",
    title: "Pages",
    singular: "Page",
    description: "Pages are used to create static content on your website.",
    bricks: ["intro"],
  },
});

const settingsCollection = new CollectionBuilder("settings", {
  config: {
    type: "single",
    title: "Settings",
    singular: "Setting",
    description: "Settings are used to configure your website.",
    bricks: ["default_meta"],
  },
});

// ------------------------------------
// Config
const config: ConfigT = {
  databaseUrl: process.env.LUCID_database_url as string,
  port: 8393,
  origin: "*",
  environment: "development",
  secretKey: "f3b2e4b00b1a4b1e9b0a8b0a9b1e0b1a",
  collections: [pageCollection, settingsCollection],
  bricks: [bannerBrick, introBrick, defaultMetaBrick],
};

export default config;
```

## Logging In

After starting the server, you can login by going to `/login`. Use the following credentials:

```
username: admin
password: admin
```

After logging in for the first time, you will be prompted to change your password, email and optionally your username.
