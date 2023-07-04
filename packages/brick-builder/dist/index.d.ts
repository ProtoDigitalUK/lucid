import z from "zod";
export interface BrickConfig {
}
export type FieldTypes = "tab" | "text" | "wysiwyg" | "image" | "file" | "repeater" | "number" | "checkbox" | "select" | "textarea" | "json" | "colour" | "datetime" | "pagelink" | "link";
export declare enum FieldTypesEnum {
    Tab = "tab",
    Text = "text",
    Wysiwyg = "wysiwyg",
    Image = "image",
    File = "file",
    Repeater = "repeater",
    Number = "number",
    Checkbox = "checkbox",
    Select = "select",
    Textarea = "textarea",
    JSON = "json",
    Colour = "colour",
    Datetime = "datetime",
    Pagelink = "pagelink",
    Link = "link"
}
export type BrickBuilderT = InstanceType<typeof BrickBuilder>;
export interface CustomField {
    type: FieldTypes;
    key: CustomFieldConfig["key"];
    title: CustomFieldConfig["title"];
    description?: CustomFieldConfig["description"];
    placeholder?: string;
    fields?: Array<CustomField>;
    default?: string | boolean;
    options?: Array<{
        label: string;
        value: string;
    }>;
    validation?: {
        zod?: z.ZodType<any>;
        required?: boolean;
        extensions?: string[];
        width?: {
            min?: number;
            max?: number;
        };
        height?: {
            min?: number;
            max?: number;
        };
    };
}
declare const baseCustomFieldSchema: z.ZodObject<{
    type: z.ZodString;
    key: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    placeholder: z.ZodOptional<z.ZodString>;
    default: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString]>>;
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
    validation: z.ZodOptional<z.ZodObject<{
        zod: z.ZodOptional<z.ZodAny>;
        required: z.ZodOptional<z.ZodBoolean>;
        extensions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        width: z.ZodOptional<z.ZodObject<{
            min: z.ZodOptional<z.ZodNumber>;
            max: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            min?: number | undefined;
            max?: number | undefined;
        }, {
            min?: number | undefined;
            max?: number | undefined;
        }>>;
        height: z.ZodOptional<z.ZodObject<{
            min: z.ZodOptional<z.ZodNumber>;
            max: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            min?: number | undefined;
            max?: number | undefined;
        }, {
            min?: number | undefined;
            max?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        zod?: any;
        required?: boolean | undefined;
        extensions?: string[] | undefined;
        width?: {
            min?: number | undefined;
            max?: number | undefined;
        } | undefined;
        height?: {
            min?: number | undefined;
            max?: number | undefined;
        } | undefined;
    }, {
        zod?: any;
        required?: boolean | undefined;
        extensions?: string[] | undefined;
        width?: {
            min?: number | undefined;
            max?: number | undefined;
        } | undefined;
        height?: {
            min?: number | undefined;
            max?: number | undefined;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    key: string;
    title: string;
    type: string;
    description?: string | undefined;
    placeholder?: string | undefined;
    default?: string | boolean | undefined;
    options?: {
        value: string;
        label: string;
    }[] | undefined;
    validation?: {
        zod?: any;
        required?: boolean | undefined;
        extensions?: string[] | undefined;
        width?: {
            min?: number | undefined;
            max?: number | undefined;
        } | undefined;
        height?: {
            min?: number | undefined;
            max?: number | undefined;
        } | undefined;
    } | undefined;
}, {
    key: string;
    title: string;
    type: string;
    description?: string | undefined;
    placeholder?: string | undefined;
    default?: string | boolean | undefined;
    options?: {
        value: string;
        label: string;
    }[] | undefined;
    validation?: {
        zod?: any;
        required?: boolean | undefined;
        extensions?: string[] | undefined;
        width?: {
            min?: number | undefined;
            max?: number | undefined;
        } | undefined;
        height?: {
            min?: number | undefined;
            max?: number | undefined;
        } | undefined;
    } | undefined;
}>;
export type Fields = z.infer<typeof baseCustomFieldSchema> & {
    fields?: Fields[];
};
export interface ValidationResponse {
    valid: boolean;
    message?: string;
}
export interface CustomFieldConfig {
    key: string;
    title?: string;
    description?: string;
    validation?: {
        required?: boolean;
    };
}
export interface TabConfig extends CustomFieldConfig {
}
export interface TextConfig extends CustomFieldConfig {
    default?: string;
    placeholder?: string;
    validation?: {
        required?: boolean;
        zod?: z.ZodType<any>;
    };
}
export interface WysiwygConfig extends CustomFieldConfig {
    default?: string;
    placeholder?: string;
    validation?: {
        required?: boolean;
        zod?: z.ZodType<any>;
    };
}
export interface ImageConfig extends CustomFieldConfig {
    validation?: {
        required?: boolean;
        extensions?: string[];
        width?: {
            min?: number;
            max?: number;
        };
        height?: {
            min?: number;
            max?: number;
        };
    };
}
export interface RepeaterConfig extends CustomFieldConfig {
    validation?: {
        required?: boolean;
    };
}
export interface NumberConfig extends CustomFieldConfig {
    default?: number;
    placeholder?: string;
    validation?: {
        required?: boolean;
        zod?: z.ZodType<any>;
    };
}
export interface CheckboxConfig extends CustomFieldConfig {
    default?: boolean;
}
export interface SelectConfig extends CustomFieldConfig {
    default?: string;
    placeholder?: string;
    options: Array<{
        label: string;
        value: string;
    }>;
}
export interface TextareaConfig extends CustomFieldConfig {
    default?: string;
    placeholder?: string;
    validation?: {
        required?: boolean;
        zod?: z.ZodType<any>;
    };
}
export interface JSONConfig extends CustomFieldConfig {
    default?: string;
    placeholder?: string;
    validation?: {
        required?: boolean;
        zod?: z.ZodType<any>;
    };
}
export interface FileConfig extends CustomFieldConfig {
    validation?: {
        required?: boolean;
        extensions?: string[];
    };
}
export interface ColourConfig extends CustomFieldConfig {
    default?: string;
    placeholder?: string;
    validation?: {
        required?: boolean;
    };
}
export interface DateTimeConfig extends CustomFieldConfig {
    default?: string;
    placeholder?: string;
    validation?: {
        required?: boolean;
    };
}
export interface PageLinkConfig extends CustomFieldConfig {
    validation?: {
        required?: boolean;
    };
}
export interface LinkConfig extends CustomFieldConfig {
    default?: string;
    placeholder?: string;
    validation?: {
        required?: boolean;
    };
}
export type FieldConfigs = TabConfig | TextConfig | WysiwygConfig | ImageConfig | NumberConfig | CheckboxConfig | SelectConfig | TextareaConfig | JSONConfig | FileConfig | ColourConfig | DateTimeConfig | PageLinkConfig;
declare const BrickBuilder: {
    new (key: string, config?: BrickConfig): {
        key: string;
        title: string;
        fields: Map<string, CustomField>;
        repeaterStack: string[];
        maxRepeaterDepth: number;
        addFields(BrickBuilder: any): any;
        endRepeater(): any;
        addTab(config: TabConfig): any;
        addText: (config: TextConfig) => any;
        addWysiwyg(config: WysiwygConfig): any;
        addImage(config: ImageConfig): any;
        addRepeater(config: RepeaterConfig): any;
        addNumber(config: NumberConfig): any;
        addCheckbox(config: CheckboxConfig): any;
        addSelect(config: SelectConfig): any;
        addTextarea(config: TextareaConfig): any;
        addJSON(config: JSONConfig): any;
        addFile(config: FileConfig): any;
        addColour(config: ColourConfig): any;
        addDateTime(config: DateTimeConfig): any;
        addPageLink(config: PageLinkConfig): any;
        addLink(config: LinkConfig): any;
        readonly fieldTree: CustomField[];
        readonly basicFieldTree: CustomField[];
        readonly flatFields: CustomField[];
        fieldValidation({ type, key, value, secondaryValue, }: {
            type: string;
            key: string;
            value: any;
            secondaryValue?: any;
        }): ValidationResponse;
        "__#1@#validateSelectType"(field: CustomField, { type, key, value, }: {
            type: string;
            key: string;
            value: string;
        }): ValidationResponse;
        "__#1@#validateWysiwygType"(field: CustomField, { type, key, value, }: {
            type: string;
            key: string;
            value: string;
        }): ValidationResponse;
        "__#1@#validateImageType"(field: CustomField, { type, key, value, }: {
            type: string;
            key: string;
            value: string;
        }): ValidationResponse;
        "__#1@#validateFileType"(field: CustomField, { type, key, value, }: {
            type: string;
            key: string;
            value: string;
        }): ValidationResponse;
        "__#1@#validateDatetimeType"({ type, key, value, }: {
            type: string;
            key: string;
            value: string;
        }): ValidationResponse;
        "__#1@#validateLinkTarget"(value: string): ValidationResponse;
        "__#1@#validateRequired"(value: any): ValidationResponse;
        "__#1@#validateType"(providedType: string, type: FieldTypes): ValidationResponse;
        "__#1@#validateZodSchema"(schema: z.ZodSchema<any>, value: any): ValidationResponse;
        "__#1@#validateIsString"(value: any): ValidationResponse;
        "__#1@#validateIsNumber"(value: any): ValidationResponse;
        "__#1@#validateIsBoolean"(value: any): ValidationResponse;
        "__#1@#keyToTitle"(key: string): string;
        "__#1@#addToFields"(type: FieldTypes, config: FieldConfigs): void;
        "__#1@#checkKeyDuplication"(key: string): void;
    };
};
export default BrickBuilder;
//# sourceMappingURL=index.d.ts.map