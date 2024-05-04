# Lucid - Nodemailer Plugin

> The official Nodemailer plugin for Lucid

This plugin registers the required email strategy config and uses Nodemailer to send emails.

## Installation

```bash
npm install @lucidcms/plugin-nodemailer
```

## lucid.config.ts/js

```typescript
import LucidNodemailer from "@lucidcms/plugin-nodemailer";

export default lucidConfig({
  // ...other config
  plugins: [
    LucidNodemailer({
      from: {
        email: "admin@lucidcms.io",
        name: "Lucid",
      },
      transporter: transporter,
    }),
  ],
});
```
