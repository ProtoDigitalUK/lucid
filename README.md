# Lucid

> IN ACTIVE DEVELOPMENT

Lucid is a headless content management system built from the ground up to be fast, secure, and easy to use for both developers and users. We take a component-based approach to building pages, which we call bricks, allowing you to create reusable bricks that can be used across multiple pages.

These bricks are defined in the Lucid config using the `BrickBuilder`, this enables you to create bricks with a range of custom fields, including wysiwyg editors, images, repeaters, and more.

## Installation

```bash
npm install @lucid/core
```

## Usage

```ts
import lucid, { BrickBuilder, ContentTypes } from "@lucid/core";

const Components = new BrickBuilder();
const ContentTypes = new ContentTypes();

lucid.start({
  port: 8393,
  database_url: "",
  s3: {
    accessKeyId: "",
    secretAccessKey: "",
    region: "",
    bucket: "",
  },
  bricks: BrickBuilder,
  content_types: ContentTypes,
});
```
