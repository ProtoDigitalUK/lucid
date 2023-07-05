# @lucid/form-builder

> IN ACTIVE DEVELOPMENT

## Features

## Usage

```typescript
new FormBuilder("contact-form", {
  title: z.string(),
  description: z.string().optional(),
  structure: [
    {
      data_key: "name",
      type: "text",
      name: "name",
      label: "Name",
      placeholder: "Enter your name",
    },
    {
      data_key: "user.email",
      type: "text",
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
    },
    {
      data_key: "user.message[0]",
      type: "textarea",
      name: "message",
      label: "Message",
      placeholder: "Enter your message",
    },
  ],
});
```
