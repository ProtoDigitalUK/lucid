import z from "zod";
import { BrickConfigOptionsT, CustomField, TabConfig, TextConfig, RepeaterConfig, WysiwygConfig, MediaConfig, NumberConfig, CheckboxConfig, SelectConfig, TextareaConfig, JSONConfig, ColourConfig, DateTimeConfig, PageLinkConfig, LinkConfig, ValidationResponse, ValidationProps } from "./types.js";
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
export default class BrickBuilder {
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
export type BrickBuilderT = InstanceType<typeof BrickBuilder>;
export * from "./types.js";
//# sourceMappingURL=index.d.ts.map