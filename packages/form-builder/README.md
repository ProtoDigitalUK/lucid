# @lucid/collection-builder

> IN ACTIVE DEVELOPMENT

CollectionBuilder is a JavaScript library designed for Lucid CMS. It simplifies the process of defining collections within the CMS, making it a powerful tool for CMS developers.

## Features

- Define "pages" or "singlepage" collections.
- Singlepage collections create a single page that contains a group of fixed or dynamic bricks. Can be used for a settings page for instance.
- Pages collection creates a group of pages that can be created, edited, and deleted. Each page contains a group of fixed or dynamic bricks.
- Collection configuration is validated using Zod, ensuring consistent and error-free setup.

## Usage

```typescript
const pageCollection = new CollectionBuilder("page", {
  config: {
    type: "pages",
    title: "Pages",
    singular: "Page",
    description: "Pages are used to create static content on your website.",
    bricks: ["banner", "intro"],
  },
});

const settingsCollection = new CollectionBuilder("settings", {
  config: {
    type: "singlepage",
    title: "Settings",
    singular: "Setting",
    description: "Settings are used to configure your website.",
    bricks: ["default_meta"],
  },
});
```
