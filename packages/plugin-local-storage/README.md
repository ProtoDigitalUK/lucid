# Lucid - Local Storage Plugin

> The official Local Storage plugin for Lucid

This plugin registers the required media strategy functions to stream, upload, update and delete media from the specified local directory.

## Installation

```bash
npm install @lucidcms/plugin-local-storage
```

## lucid.config.ts/js

```typescript
import LucidLocalStorage from "@lucidcms/plugin-local-storage";

export default lucidConfig({
  // ...other config
  plugins: [
    LucidLocalStorage({
      uploadDir: "./uploads",
    }),
  ],
});
```
