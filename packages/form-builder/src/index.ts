import z from "zod";

const FormBuilderOptionsSchema = z.object({
  title: z.string(),
  description: z.string().optional(),

  structure: z.array(
    z.object({
      data_key: z.string(),
      type: z.enum([
        "text",
        "number",
        "select",
        "checkbox",
        "radio",
        "date",
        "textarea",
        "file",
        "image",
      ]),
      name: z.string(),
      label: z.string(),
      placeholder: z.string().optional(),
      options: z
        .array(
          z.object({
            label: z.string(),
            value: z.string(),
          })
        )
        .optional(),
    })
  ),
});

// ------------------------------------
// Types & Interfaces
export interface FormBuilderOptionsT {}

export type FormBuilderT = InstanceType<typeof FormBuilder>;

// ------------------------------------
// Form Builder
export default class FormBuilder {
  key: string;
  options: FormBuilderOptionsT;
  constructor(key: string, options: FormBuilderOptionsT) {
    this.key = key;
    this.options = options;

    this.#validateOptions(options);
  }
  // ------------------------------------
  // Methods

  // ------------------------------------
  // Getters

  // ------------------------------------
  // External Methods

  // ------------------------------------
  // Private Methods
  #validateOptions = (options: FormBuilderOptionsT) => {
    try {
      FormBuilderOptionsSchema.parse(options);
    } catch (err) {
      console.error(err);
      throw new Error("Invalid Formm Builder Config");
    }
  };
}
