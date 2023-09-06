"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const FormBuilderOptionsSchema = zod_1.default.object({
    title: zod_1.default.string(),
    description: zod_1.default.string().optional(),
    fields: zod_1.default.array(zod_1.default.object({
        zod: zod_1.default.any().optional(),
        type: zod_1.default.enum([
            "text",
            "number",
            "select",
            "checkbox",
            "radio",
            "date",
            "textarea",
        ]),
        name: zod_1.default.string(),
        label: zod_1.default.string(),
        placeholder: zod_1.default.string().optional(),
        options: zod_1.default
            .array(zod_1.default.object({
            label: zod_1.default.string(),
            value: zod_1.default.string(),
        }))
            .optional(),
        default_value: zod_1.default.union([zod_1.default.string(), zod_1.default.number(), zod_1.default.boolean()]).optional(),
        show_in_table: zod_1.default.boolean().optional(),
    })),
});
class FormBuilder {
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
exports.default = FormBuilder;
//# sourceMappingURL=index.js.map