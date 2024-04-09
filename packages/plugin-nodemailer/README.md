# Proto Headless - Nodemailer Plugin

> The official Nodemailer plugin for Proto Headless

This plugin registers the required email strategy config and uses Nodemailer to send emails.

## Installation

```bash
npm install @protoheadless/plugin-nodemailer
```

## headless.config.ts/js

```typescript
import HeadlessNodemailer from "@protoheadless/plugin-nodemailer";

export default headlessConfig({
  // ...other config
  plugins: [
    HeadlessNodemailer({
      from: {
        email: "admin@protoheadless.com",
        name: "Proto Headless",
      },
      transporter: transporter,
    }),
  ],
});
```
