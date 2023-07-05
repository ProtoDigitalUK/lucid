# @lucid/form-builder

FormBuilder works in conjunction with Lucid Core to provide a way to define the structure of form data. The CMS uses this information to generate pages to display all recorded form submissions.

The Core package provides a function to store form submissions in the database, so depending on the data you choose to save there, you can use this to define how it looks in the CMS. The `data_key` value is used to determine the path to the data, where `.` is used to denote a nested object, and `[]` is used to denote an array.

## Usage

```typescript
import { FormBuilder } from "@lucid/core";

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
