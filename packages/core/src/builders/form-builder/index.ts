import z from "zod";

const FormBuilderOptionsSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  fields: z.array(
    z.object({
      zod: z.any().optional(),
      type: z.enum([
        "text",
        "number",
        "select",
        "checkbox",
        "radio",
        "date",
        "textarea",
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
      default_value: z.union([z.string(), z.number(), z.boolean()]).optional(),
      show_in_table: z.boolean().optional(),
    })
  ),
});

// ------------------------------------
// Types & Interfaces
export type FormBuilderOptionsT = z.infer<typeof FormBuilderOptionsSchema>;

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
  // External Functions
  validate = async (data: { [key: string]: string | number | boolean }) => {
    const errors: {
      [key: string]: string[];
    } = {};

    for (const key in data) {
      const field = this.options.fields.find((field) => field.name === key);
      if (field && field.zod) {
        const result = await field.zod.safeParseAsync(data[key]);
        if (!result.success) {
          const zerrors: z.ZodError = result.error;
          const issues = zerrors.issues;
          errors[key] = issues.map((err) => err.message);
        }
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors: errors,
    };
  };
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
