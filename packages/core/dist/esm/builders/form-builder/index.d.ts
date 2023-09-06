import z from "zod";
declare const FormBuilderOptionsSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    fields: z.ZodArray<z.ZodObject<{
        zod: z.ZodOptional<z.ZodAny>;
        type: z.ZodEnum<["text", "number", "select", "checkbox", "radio", "date", "textarea"]>;
        name: z.ZodString;
        label: z.ZodString;
        placeholder: z.ZodOptional<z.ZodString>;
        options: z.ZodOptional<z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            value: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: string;
            label: string;
        }, {
            value: string;
            label: string;
        }>, "many">>;
        default_value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
        show_in_table: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: "number" | "text" | "checkbox" | "select" | "textarea" | "date" | "radio";
        label: string;
        zod?: any;
        placeholder?: string | undefined;
        options?: {
            value: string;
            label: string;
        }[] | undefined;
        default_value?: string | number | boolean | undefined;
        show_in_table?: boolean | undefined;
    }, {
        name: string;
        type: "number" | "text" | "checkbox" | "select" | "textarea" | "date" | "radio";
        label: string;
        zod?: any;
        placeholder?: string | undefined;
        options?: {
            value: string;
            label: string;
        }[] | undefined;
        default_value?: string | number | boolean | undefined;
        show_in_table?: boolean | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    title: string;
    fields: {
        name: string;
        type: "number" | "text" | "checkbox" | "select" | "textarea" | "date" | "radio";
        label: string;
        zod?: any;
        placeholder?: string | undefined;
        options?: {
            value: string;
            label: string;
        }[] | undefined;
        default_value?: string | number | boolean | undefined;
        show_in_table?: boolean | undefined;
    }[];
    description?: string | undefined;
}, {
    title: string;
    fields: {
        name: string;
        type: "number" | "text" | "checkbox" | "select" | "textarea" | "date" | "radio";
        label: string;
        zod?: any;
        placeholder?: string | undefined;
        options?: {
            value: string;
            label: string;
        }[] | undefined;
        default_value?: string | number | boolean | undefined;
        show_in_table?: boolean | undefined;
    }[];
    description?: string | undefined;
}>;
export type FormBuilderOptionsT = z.infer<typeof FormBuilderOptionsSchema>;
export type FormBuilderT = InstanceType<typeof FormBuilder>;
export default class FormBuilder {
    #private;
    key: string;
    options: FormBuilderOptionsT;
    constructor(key: string, options: FormBuilderOptionsT);
    validate: (data: {
        [key: string]: string | number | boolean;
    }) => Promise<{
        valid: boolean;
        errors: {
            [key: string]: string[];
        };
    }>;
}
export {};
//# sourceMappingURL=index.d.ts.map