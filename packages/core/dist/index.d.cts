import * as express from 'express';
import express__default from 'express';
import z from 'zod';

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
type FormBuilderOptionsT = z.infer<typeof FormBuilderOptionsSchema>;
type FormBuilderT = InstanceType<typeof FormBuilder>;
declare class FormBuilder {
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

interface ServiceData {
    environment_key: string;
    form: FormBuilder;
    data: {
        [key: string]: string | number | boolean;
    };
}

interface EmailParamsT {
    data: {
        [key: string]: any;
    };
    options?: {
        to: string;
        subject: string;
        from?: string;
        fromName?: string;
        cc?: string;
        bcc?: string;
        replyTo?: string;
    };
}

declare const app: (options: InitOptions) => Promise<express__default.Express>;

interface CollectionOptions {
    type: "pages" | "singlepage";
    title: string;
    singular: string;
    description: string | undefined;
    bricks: Array<CollectionBrickConfigT>;
}
interface CollectionBrickConfigT {
    key: string;
    type: "builder" | "fixed";
    position?: "standard" | "bottom" | "top" | "sidebar";
}
type CollectionBuilderT = InstanceType<typeof CollectionBuilder>;
declare class CollectionBuilder {
    #private;
    key: string;
    config: CollectionOptions;
    constructor(key: string, options: CollectionOptions);
}

interface BrickConfigOptionsT {
    preview?: {
        mode: "image";
        image?: {
            url: string;
        };
    };
}
type FieldTypes = "tab" | "text" | "wysiwyg" | "media" | "repeater" | "number" | "checkbox" | "select" | "textarea" | "json" | "colour" | "datetime" | "pagelink" | "link";
interface CustomField {
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
interface ValidationProps {
    type: FieldTypes;
    key: CustomFieldConfig["key"];
    value: any;
    referenceData?: MediaReferenceData | LinkReferenceData;
    flatFieldConfig: CustomField[];
}
interface ValidationResponse {
    valid: boolean;
    message?: string;
}
interface LinkReferenceData {
    target: string;
}
interface MediaReferenceData {
    extension: string;
    width: number | null;
    height: number | null;
}
interface CustomFieldConfig {
    key: string;
    title?: string;
    description?: string;
    validation?: {
        required?: boolean;
    };
}
interface TabConfig extends CustomFieldConfig {
}
interface TextConfig extends CustomFieldConfig {
    default?: string;
    placeholder?: string;
    validation?: {
        required?: boolean;
        zod?: z.ZodType<any>;
    };
}
interface WysiwygConfig extends CustomFieldConfig {
    default?: string;
    placeholder?: string;
    validation?: {
        required?: boolean;
        zod?: z.ZodType<any>;
    };
}
interface MediaConfig extends CustomFieldConfig {
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
    };
}
interface NumberConfig extends CustomFieldConfig {
    default?: number;
    placeholder?: string;
    validation?: {
        required?: boolean;
        zod?: z.ZodType<any>;
    };
}
interface CheckboxConfig extends CustomFieldConfig {
    default?: boolean;
}
interface SelectConfig extends CustomFieldConfig {
    default?: string;
    placeholder?: string;
    options: Array<{
        label: string;
        value: string;
    }>;
}
interface TextareaConfig extends CustomFieldConfig {
    default?: string;
    placeholder?: string;
    validation?: {
        required?: boolean;
        zod?: z.ZodType<any>;
    };
}
interface JSONConfig extends CustomFieldConfig {
    default?: string;
    placeholder?: string;
    validation?: {
        required?: boolean;
        zod?: z.ZodType<any>;
    };
}
interface ColourConfig extends CustomFieldConfig {
    default?: string;
    placeholder?: string;
    validation?: {
        required?: boolean;
    };
}
interface DateTimeConfig extends CustomFieldConfig {
    default?: string;
    placeholder?: string;
    validation?: {
        required?: boolean;
    };
}
interface PageLinkConfig extends CustomFieldConfig {
    validation?: {
        required?: boolean;
    };
}
interface LinkConfig extends CustomFieldConfig {
    default?: string;
    placeholder?: string;
    validation?: {
        required?: boolean;
    };
}

declare class BrickBuilder {
    #private;
    key: string;
    title: string;
    fields: Map<string, CustomField>;
    repeaterStack: string[];
    maxRepeaterDepth: number;
    config: BrickConfigOptionsT;
    constructor(key: string, config?: BrickConfigOptionsT);
    addFields(BrickBuilder: BrickBuilder): this;
    endRepeater(): this;
    addTab(config: TabConfig): this;
    addText: (config: TextConfig) => this;
    addWysiwyg(config: WysiwygConfig): this;
    addMedia(config: MediaConfig): this;
    addRepeater(config: RepeaterConfig): this;
    addNumber(config: NumberConfig): this;
    addCheckbox(config: CheckboxConfig): this;
    addSelect(config: SelectConfig): this;
    addTextarea(config: TextareaConfig): this;
    addJSON(config: JSONConfig): this;
    addColour(config: ColourConfig): this;
    addDateTime(config: DateTimeConfig): this;
    addPageLink(config: PageLinkConfig): this;
    addLink(config: LinkConfig): this;
    get fieldTree(): CustomField[];
    get basicFieldTree(): CustomField[];
    get flatFields(): CustomField[];
    private fieldTypeToDataType;
    fieldValidation({ type, key, value, referenceData, flatFieldConfig, }: ValidationProps): ValidationResponse;
}
type BrickBuilderT = InstanceType<typeof BrickBuilder>;

type ConfigT = {
    host: string;
    origin: string;
    mode: "development" | "production";
    postgresURL: string;
    secret: string;
    forms?: FormBuilderT[];
    collections?: CollectionBuilderT[];
    bricks?: BrickBuilderT[];
    media: {
        storageLimit?: number;
        maxFileSize?: number;
        fallbackImage?: string | false;
        processedImageLimit?: number;
        store: {
            service: "aws" | "cloudflare";
            cloudflareAccountId?: string;
            region?: string;
            bucket: string;
            accessKeyId: string;
            secretAccessKey: string;
        };
    };
    email?: {
        from: {
            name: string;
            email: string;
        };
        templateDir?: string;
        smtp?: {
            host: string;
            port: number;
            user: string;
            pass: string;
            secure?: boolean;
        };
    };
};
declare const buildConfig: (config: ConfigT) => ConfigT;

declare const sendEmail: (template: string, params: EmailParamsT, track?: boolean | undefined) => Promise<{
    success: boolean;
    message: string;
}>;
declare const submitForm: (props: ServiceData) => Promise<void>;

declare const _default: {
    init: (options: InitOptions) => Promise<express.Express>;
};

export { BrickBuilder, CollectionBuilder, ConfigT as Config, FormBuilder, buildConfig, _default as default, app as init, sendEmail, submitForm };
