import z from "zod";
interface BrickConfig {
}
type FieldTypes = "tab" | "text" | "wysiwyg" | "image" | "file" | "repeater" | "number" | "checkbox" | "select" | "textarea" | "json";
declare enum FieldTypesEnum {
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
    JSON = "json"
}
type BrickBuilderT = InstanceType<typeof BrickBuilder>;
interface CustomField {
    type: FieldTypes;
    key: CustomFieldConfig["key"];
    title: CustomFieldConfig["title"];
    description?: CustomFieldConfig["description"];
    placeholder?: CustomFieldConfig["placeholder"];
    fields?: Array<CustomField>;
    options?: Array<{
        label: string;
        value: string;
    }>;
    validation?: {
        zod?: z.ZodType<any>;
        required?: boolean;
        min?: number;
        max?: number;
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
interface ValidationResponse {
    valid: boolean;
    message?: string;
}
interface CustomFieldConfig {
    key: string;
    title?: string;
    description?: string;
    placeholder?: string;
    validation?: {
        required?: boolean;
    };
}
interface TabConfig extends CustomFieldConfig {
}
interface TextConfig extends CustomFieldConfig {
    validation?: {
        required?: boolean;
        zod?: z.ZodType<any>;
    };
}
interface WysiwygConfig extends CustomFieldConfig {
    validation?: {
        required?: boolean;
        zod?: z.ZodType<any>;
    };
}
interface ImageConfig extends CustomFieldConfig {
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
interface RepeaterConfig extends CustomFieldConfig {
    validation?: {
        required?: boolean;
        min?: number;
        max?: number;
    };
}
interface NumberConfig extends CustomFieldConfig {
    validation?: {
        required?: boolean;
        zod?: z.ZodType<any>;
    };
}
interface CheckboxConfig extends CustomFieldConfig {
}
interface SelectConfig extends CustomFieldConfig {
    options: Array<{
        label: string;
        value: string;
    }>;
}
interface TextareaConfig extends CustomFieldConfig {
    validation?: {
        required?: boolean;
        zod?: z.ZodType<any>;
    };
}
interface JSONConfig extends CustomFieldConfig {
    validation?: {
        required?: boolean;
        zod?: z.ZodType<any>;
    };
}
type FieldConfigs = TabConfig | TextConfig | WysiwygConfig | ImageConfig | NumberConfig | CheckboxConfig | SelectConfig | TextareaConfig | JSONConfig;
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
        readonly fieldTree: CustomField[];
        readonly flatFields: CustomField[];
        validateTextType({ type, key, value, }: {
            type: string;
            key: string;
            value: string;
        }): ValidationResponse;
        validateRequired(value: any): ValidationResponse;
        validateType(providedType: string, type: FieldTypes): ValidationResponse;
        validateZodSchema(schema: z.ZodSchema<any>, value: any): ValidationResponse;
        "__#1@#keyToTitle"(key: string): string;
        "__#1@#addToFields"(type: FieldTypes, config: FieldConfigs): void;
        "__#1@#checkKeyDuplication"(key: string): void;
    };
};
export { BrickBuilderT, CustomField, FieldTypes, FieldTypesEnum };
export default BrickBuilder;
//# sourceMappingURL=index.d.ts.map