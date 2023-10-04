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

interface ServiceData$1 {
    environment_key: string;
    form: FormBuilder;
    data: {
        [key: string]: string | number | boolean;
    };
}

interface ServiceData {
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

declare const CollectionOptionsSchema: z.ZodObject<{
    type: z.ZodEnum<["pages", "singlepage"]>;
    title: z.ZodString;
    singular: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    path: z.ZodOptional<z.ZodString>;
    disableHomepage: z.ZodOptional<z.ZodBoolean>;
    disableParent: z.ZodOptional<z.ZodBoolean>;
    bricks: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        type: z.ZodEnum<["builder", "fixed"]>;
        position: z.ZodOptional<z.ZodEnum<["bottom", "top", "sidebar"]>>;
    }, "strip", z.ZodTypeAny, {
        key: string;
        type: "builder" | "fixed";
        position?: "bottom" | "top" | "sidebar" | undefined;
    }, {
        key: string;
        type: "builder" | "fixed";
        position?: "bottom" | "top" | "sidebar" | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    title: string;
    type: "pages" | "singlepage";
    singular: string;
    bricks: {
        key: string;
        type: "builder" | "fixed";
        position?: "bottom" | "top" | "sidebar" | undefined;
    }[];
    description?: string | undefined;
    path?: string | undefined;
    disableHomepage?: boolean | undefined;
    disableParent?: boolean | undefined;
}, {
    title: string;
    type: "pages" | "singlepage";
    singular: string;
    bricks: {
        key: string;
        type: "builder" | "fixed";
        position?: "bottom" | "top" | "sidebar" | undefined;
    }[];
    description?: string | undefined;
    path?: string | undefined;
    disableHomepage?: boolean | undefined;
    disableParent?: boolean | undefined;
}>;
type CollectionConfigT = z.infer<typeof CollectionOptionsSchema>;
type CollectionBuilderT = InstanceType<typeof CollectionBuilder>;
declare class CollectionBuilder {
    #private;
    key: string;
    config: CollectionConfigT;
    constructor(key: string, options: CollectionConfigT);
}

interface BrickConfigOptionsT {
    preview?: {
        image?: string;
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
    default?: defaultFieldValues;
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
}
interface TabConfig extends CustomFieldConfig {
    title: string;
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
    default?: {
        [key: string]: any;
    };
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
type defaultFieldValues = TextConfig["default"] | WysiwygConfig["default"] | NumberConfig["default"] | CheckboxConfig["default"] | SelectConfig["default"] | TextareaConfig["default"] | JSONConfig["default"] | ColourConfig["default"] | DateTimeConfig["default"];

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

declare const configSchema: z.ZodObject<{
    host: z.ZodString;
    origin: z.ZodString;
    mode: z.ZodEnum<["development", "production"]>;
    postgresURL: z.ZodString;
    secret: z.ZodString;
    forms: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    collections: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    bricks: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    media: z.ZodObject<{
        storageLimit: z.ZodOptional<z.ZodNumber>;
        maxFileSize: z.ZodOptional<z.ZodNumber>;
        fallbackImage: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodBoolean]>>;
        processedImageLimit: z.ZodOptional<z.ZodNumber>;
        store: z.ZodObject<{
            service: z.ZodEnum<["aws", "cloudflare"]>;
            cloudflareAccountId: z.ZodOptional<z.ZodString>;
            region: z.ZodString;
            bucket: z.ZodString;
            accessKeyId: z.ZodString;
            secretAccessKey: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            service: "aws" | "cloudflare";
            region: string;
            bucket: string;
            accessKeyId: string;
            secretAccessKey: string;
            cloudflareAccountId?: string | undefined;
        }, {
            service: "aws" | "cloudflare";
            region: string;
            bucket: string;
            accessKeyId: string;
            secretAccessKey: string;
            cloudflareAccountId?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        store: {
            service: "aws" | "cloudflare";
            region: string;
            bucket: string;
            accessKeyId: string;
            secretAccessKey: string;
            cloudflareAccountId?: string | undefined;
        };
        storageLimit?: number | undefined;
        maxFileSize?: number | undefined;
        fallbackImage?: string | boolean | undefined;
        processedImageLimit?: number | undefined;
    }, {
        store: {
            service: "aws" | "cloudflare";
            region: string;
            bucket: string;
            accessKeyId: string;
            secretAccessKey: string;
            cloudflareAccountId?: string | undefined;
        };
        storageLimit?: number | undefined;
        maxFileSize?: number | undefined;
        fallbackImage?: string | boolean | undefined;
        processedImageLimit?: number | undefined;
    }>;
    email: z.ZodOptional<z.ZodObject<{
        from: z.ZodObject<{
            name: z.ZodString;
            email: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            email: string;
        }, {
            name: string;
            email: string;
        }>;
        templateDir: z.ZodOptional<z.ZodString>;
        smtp: z.ZodOptional<z.ZodObject<{
            host: z.ZodString;
            port: z.ZodNumber;
            user: z.ZodString;
            pass: z.ZodString;
            secure: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            host: string;
            port: number;
            user: string;
            pass: string;
            secure?: boolean | undefined;
        }, {
            host: string;
            port: number;
            user: string;
            pass: string;
            secure?: boolean | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        from: {
            name: string;
            email: string;
        };
        templateDir?: string | undefined;
        smtp?: {
            host: string;
            port: number;
            user: string;
            pass: string;
            secure?: boolean | undefined;
        } | undefined;
    }, {
        from: {
            name: string;
            email: string;
        };
        templateDir?: string | undefined;
        smtp?: {
            host: string;
            port: number;
            user: string;
            pass: string;
            secure?: boolean | undefined;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    media: {
        store: {
            service: "aws" | "cloudflare";
            region: string;
            bucket: string;
            accessKeyId: string;
            secretAccessKey: string;
            cloudflareAccountId?: string | undefined;
        };
        storageLimit?: number | undefined;
        maxFileSize?: number | undefined;
        fallbackImage?: string | boolean | undefined;
        processedImageLimit?: number | undefined;
    };
    host: string;
    origin: string;
    mode: "development" | "production";
    postgresURL: string;
    secret: string;
    forms?: any[] | undefined;
    collections?: any[] | undefined;
    bricks?: any[] | undefined;
    email?: {
        from: {
            name: string;
            email: string;
        };
        templateDir?: string | undefined;
        smtp?: {
            host: string;
            port: number;
            user: string;
            pass: string;
            secure?: boolean | undefined;
        } | undefined;
    } | undefined;
}, {
    media: {
        store: {
            service: "aws" | "cloudflare";
            region: string;
            bucket: string;
            accessKeyId: string;
            secretAccessKey: string;
            cloudflareAccountId?: string | undefined;
        };
        storageLimit?: number | undefined;
        maxFileSize?: number | undefined;
        fallbackImage?: string | boolean | undefined;
        processedImageLimit?: number | undefined;
    };
    host: string;
    origin: string;
    mode: "development" | "production";
    postgresURL: string;
    secret: string;
    forms?: any[] | undefined;
    collections?: any[] | undefined;
    bricks?: any[] | undefined;
    email?: {
        from: {
            name: string;
            email: string;
        };
        templateDir?: string | undefined;
        smtp?: {
            host: string;
            port: number;
            user: string;
            pass: string;
            secure?: boolean | undefined;
        } | undefined;
    } | undefined;
}>;
interface ConfigT extends z.infer<typeof configSchema> {
    forms?: FormBuilderT[];
    collections?: CollectionBuilderT[];
    bricks?: BrickBuilderT[];
}
declare const buildConfig: (config: ConfigT) => ConfigT;

declare const sendEmail: (template: string, params: ServiceData) => Promise<{
    success: boolean;
    message: string;
}>;
declare const submitForm: (props: ServiceData$1) => Promise<void>;

declare const _default: {
    init: (options: InitOptions) => Promise<express.Express>;
};

export { BrickBuilder, CollectionBuilder, ConfigT as Config, FormBuilder, buildConfig, _default as default, app as init, sendEmail, submitForm };
