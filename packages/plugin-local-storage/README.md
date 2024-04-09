# Proto Headless - Local Storage Plugin

> The official Local Storage plugin for Proto Headless

This plugin registers the required media strategy functions to stream, upload, update and delete media from the specified local directory.

## Installation

```bash
npm install @protoheadless/plugin-local-storage
```

## headless.config.ts/js

```typescript
import HeadlessLocalStorage from "@protoheadless/plugin-local-storage";

export default headlessConfig({
  // ...other config
  plugins: [
    HeadlessLocalStorage({
      uploadDir: "./uploads",
    }),
  ],
});
```
