import { FormBuilder } from "@lucid/core";
import z from "zod";

export const ContactForm = new FormBuilder("contact-form", {
  title: "Contact Form",
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      zod: z.string().min(3),
      show_in_table: true,
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      zod: z.string().email(),
      show_in_table: true,
    },
    {
      name: "message",
      label: "Message",
      type: "textarea",
    },
  ],
});
