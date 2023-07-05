# @lucid/brick-builder

BrickBuilder is a JavaScript library designed to provide a flexible and dynamic way to construct content structures for Content Management Systems (CMS). It takes inspiration from the Advanced Custom Fields (ACF) plugin for WordPress, allowing developers to build custom fields, tabs, and repeaters to define complex content structures.

## Key Features

- Define your content structure using various field types, including text, image, select, checkbox, and more.
- Use tabs to group related fields together.
- Use repeaters to define a group of fields that can be repeated multiple times.
- Validate the data provided to the fields using custom validation functions.

## Usage

```typescript
import { BrickBuilder } from "@lucid/core";

const myBrick = new BrickBuilder("my_brick")
  .addTab({
    key: "content_tab",
  })
  .addText({
    key: "title",
    description: "The title of the banner",
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
```

## Limitations

- While repeaters provide the flexibility to nest fields within fields, this can only be done up to a depth of 5 levels.
- Tabs are designed to group fields at the top level and cannot be used within repeaters.
