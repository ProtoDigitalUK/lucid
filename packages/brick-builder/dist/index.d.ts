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
    key: string;
    title: string;
    description?: string;
    placeholder?: string;
    required?: boolean;
    min?: number;
    max?: number;
    validate?: (value: string | number | boolean) => string;
    pattern?: string;
    fields?: Array<CustomField>;
}
interface CustomFieldConfig {
    key: string;
    title?: string;
    description?: string;
    placeholder?: string;
    required?: boolean;
    min?: number;
    max?: number;
    validate?: (value: string | number | boolean) => string;
    pattern?: string;
}
interface TabConfig extends CustomFieldConfig {
}
interface TextConfig extends CustomFieldConfig {
    pattern?: string;
}
interface WysiwygConfig extends CustomFieldConfig {
}
interface ImageConfig extends CustomFieldConfig {
}
interface RepeaterConfig extends CustomFieldConfig {
}
interface NumberConfig extends CustomFieldConfig {
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
}
interface JSONConfig extends CustomFieldConfig {
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
        "__#1@#keyToTitle"(key: string): string;
        "__#1@#addToFields"(type: FieldTypes, config: FieldConfigs): void;
        "__#1@#checkKeyDuplication"(key: string): void;
    };
    validateBrickData(data: any): boolean;
};
export { BrickBuilderT, CustomField, FieldTypes, FieldTypesEnum };
export default BrickBuilder;
//# sourceMappingURL=index.d.ts.map