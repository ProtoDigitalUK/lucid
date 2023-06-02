# @lucid/collection-builder

> IN ACTIVE DEVELOPMENT

CollectionBuilder is a JavaScript library designed for Lucid CMS. It simplifies the process of defining collections within the CMS, making it a powerful tool for CMS developers.

## Features

- Define "single" or "multiple" collections.
- Single collections represent standalone pages or groups, while multiple collections create a new section in the CMS where users can createe individual pages.
- Assign "bricks" (building blocks for the CMS) to each collection. For multiple collections, these bricks represent the allowed components within the page builder. For single collections, these bricks form a group where users can enter data.
- Collection configuration is validated using Zod, ensuring consistent and error-free setup.

## Usage

```typescript
const pageCollection = new CollectionBuilder("page", {
  config: {
    type: "multiple",
    title: "Pages",
    singular: "Page",
    description: "Pages are used to create static content on your website.",
    bricks: ["banner", "intro"],
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
```
