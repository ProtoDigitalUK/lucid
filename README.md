![Lucid CMS](https://github.com/ProtoDigitalUK/lucid/blob/master/banner.jpg?raw=true)

[![NPM Version](https://img.shields.io/npm/v/@lucidcms/core/latest.svg)](https://www.npmjs.com/package/@lucidcms/core)
[![Tests](https://github.com/ProtoDigitalUK/lucid/actions/workflows/tests.yml/badge.svg)](https://github.com/ProtoDigitalUK/lucid/actions/workflows/tests.yml)

A TypeScript-first, fully extensible headless CMS. Constructed using Fastify and SolidJS, it features sophisticated collection and brick builders, a wide range of plugins, and database adapters for PostgreSQL, LibSQL, and SQLite. It achieves the perfect balance of developer experience and an intuitive, easy-to-use interface for creators and end-users alike, without compromising on performance and flexibility.

Effortlessly configure Lucid to meet your content needs with our flexible configuration options, and an array of first-party plugins including LocalStorage, Resend, Nodemailer, S3, and more.

## Installation

```bash
npm install @lucidcms/core
```

## Features

- PostgreSQL, LibSQL and SQLite DB adapters
- Collection & Brick Builder w/ 15 Custom Fields
- Media library w/ Custom Stategies
- Emails w/ Custom Stategies
- On Request Image Optimisation/Resizing
- Users and Roles
- Full Localisation Support
- Plugin Support
- Hook Support

## First Party Plugins

- [Forms](https://github.com/ProtoDigitalUK/lucid/tree/master/packages/plugin-forms)
- [Nested Documents](https://github.com/ProtoDigitalUK/lucid/tree/master/packages/plugin-nested-documents)
- [Cookie Consent](https://github.com/ProtoDigitalUK/lucid/tree/master/packages/plugin-cookie-consent)
- [Resend](https://github.com/ProtoDigitalUK/lucid/tree/master/packages/plugin-resend)
- [Nodemailer](https://github.com/ProtoDigitalUK/lucid/tree/master/packages/plugin-nodemailer)
- [S3](https://github.com/ProtoDigitalUK/lucid/tree/master/packages/plugin-s3)
- [Local Storage](https://github.com/ProtoDigitalUK/lucid/tree/master/packages/plugin-local-storage)

## lucid.config.ts/js

```ts
import lucid, { LibsqlAdapter } from "@lucidcms/core";
// Plugins
import LucidNodemailer from "@lucidcms/plugin-nodemailer";
import LucidS3 from "@lucidcms/plugin-s3";
import LucidLocalStorage from "@lucidcms/plugin-local-storage";
// Collections
import { PageCollection, SettingsCollection } from "./collections.js";

export default lucid.config({
  host: "http://localhost:8393",
  db: new LibsqlAdapter({
    url: "libsql://localhost:8080?tls=0",
  }),
  keys: {
    cookieSecret: process.env.LUCID_COOKIE_SECRET as string,
    refreshTokenSecret: process.env.LUCID_REFRESH_TOKEN_SECRET as string,
    accessTokenSecret: process.env.LUCID_ACCESS_TOKEN_SECRET as string,
  },
  localisation: {
    locales: [
      {
        label: "English",
        code: "en",
      },
      {
        label: "French",
        code: "fr",
      },
    ],
    defaultLocale: "en",
  },
  hooks: [
    {
      service: "collection-documents",
      event: "beforeUpsert",
      handler: async (props) => {},
    },
  ],
  collections: [PageCollection, SettingsCollection],
  plugins: [
    LucidNodemailer({
      from: {
        email: "admin@lucidcms.io",
        name: "Lucid",
      },
      transporter: transporter,
    }),
    LucidLocalStorage({
      uploadDir: "uploads",
    }),
  ],
});
```

## Collection Example

Collections in Lucid allow you to define a type content. Within these collections exist documents. A collection can either contain multiple, or just a single document depending on the `mode` flag. Collections give you the flexibility to add fields, builder bricks and fixed bricks against them. The custom fields these contain will then be available on the document page builder.

```typescript
import { CollectionBuilder } from "@lucidcms/core";
// Bricks
import Banner from "./bricks/banner.js";
import SEO from "./bricks/seo.js";

export const PageCollection = new CollectionBuilder("page", {
  mode: "multiple",
  title: "Pages",
  singular: "Page",
  description: "Pages are used to create static content on your website.",
  translations: true,
  hooks: [
    {
      event: "beforeUpsert",
      handler: async (props) => {},
    },
  ],
  bricks: {
    fixed: [SEO],
    builder: [Banner],
  },
})
  .addText({
    key: "page_title",
    collection: {
      list: true,
      filterable: true,
    },
  })
  .addTextarea({
    key: "page_excerpt",
    collection: {
      list: true,
      filterable: true,
    },
  })
  .addCheckbox({
    key: "page_featured",
    translations: true,
    collection: {
      filterable: true,
    },
  })
  .addUser({
    key: "author",
    collection: {
      list: true,
    },
  });

export const SettingsCollection = new CollectionBuilder("settings", {
  mode: "single",
  title: "Settings",
  singular: "Setting",
  description: "Set shared settings for your website.",
  translations: false,
  bricks: {
    fixed: [],
    builder: [],
  },
}).addMedia({
  key: "site_logo",
  title: "Logo",
});
```

## Brick Example

Bricks at their core are just groups of custom fields. They can only be consumed through collections.

```typescript
import { BrickBuilder } from "@lucidcms/core";

const Banner = new BrickBuilder("banner", {
  description: "A banner with a title and intro text",
  preview: {
    image: "https://placehold.co/600x400",
  },
})
  .addTab({
    title: "Content",
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
    key: "cta",
    validation: {
      maxGroups: 3,
    },
  })
  .addText({
    key: "cta_title",
  })
  .addText({
    key: "cta_url",
  })
  .endRepeater()
  .addTab({
    title: "Config",
    key: "config_tab",
  })
  .addCheckbox({
    key: "fullwidth",
    description: "Make the banner full-width",
  });

export default Banner;
```

## Roadmap

- Implement a collection document reference custom field type.
- App integration system.
- Public endpoints so collection documents etc can be called via the app auth.
- Core library to export an API to programatically update content.
- Endpoint caching with config support to swap out the stategy.
- Customisable view document link support.
- Collection document lock if a user is editing the document.
- Collection level permission support.
- Blur hash and average colour generation on media image upload.
- Nested collection plugin (adds slugs and full slugs based on parent document relations).
- Form builder plugin.
- Menu builder plugin.
- Cookie consent plugin.
- Brick pattern support with a fixed and template mode. If its fixed values cant be mutated, if its template they can be.
- Collection revision system so changes can be reverted.
- Sitemap generation plugin.
- SEO plugin.
- Brick and document live previews.
- Document search indexing w/ endpoint to search document content.
- An AI document fill tool (takes in a prompt and context of available bricks and the collection to generate all of the content for a document).
- An AI custom field fill tool.
- An AI alt tag generation on media images.
- Support to extend the CMS frontend to add new pages, swap out components add custom features etc.
