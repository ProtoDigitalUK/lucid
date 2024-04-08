# Proto Digital Headless - Local Storage Plugin

> The official Local Storage plugin for Proto Digital Headless

## Installation

```bash
npm install @protodigital/headless-plugin-local-storage
```

## headless.config.ts/js

```typescript
export default headlessConfig({
  // ...other config
  plugins: [
    LocalStoragePlugin({
      uploadDir: "./uploads",
    }),
  ],
});
```
