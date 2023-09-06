import z from "zod";
const FormBuilderOptionsSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    fields: z.array(z.object({
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
            .array(z.object({
            label: z.string(),
            value: z.string(),
        }))
            .optional(),
        default_value: z.union([z.string(), z.number(), z.boolean()]).optional(),
        show_in_table: z.boolean().optional(),
    })),
});
export default class FormBuilder {
    key;
    options;
    constructor(key, options) {
        this.key = key;
        this.options = options;
        this.#validateOptions(options);
    }
    validate = async (data) => {
        const errors = {};
        for (const key in data) {
            const field = this.options.fields.find((field) => field.name === key);
            if (field && field.zod) {
                const result = await field.zod.safeParseAsync(data[key]);
                if (!result.success) {
                    const zerrors = result.error;
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
    #validateOptions = (options) => {
        try {
            FormBuilderOptionsSchema.parse(options);
        }
        catch (err) {
            console.error(err);
            throw new Error("Invalid Formm Builder Config");
        }
    };
}
//# sourceMappingURL=index.js.map