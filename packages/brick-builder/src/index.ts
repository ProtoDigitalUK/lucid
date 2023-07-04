import z from "zod";
import sanitizeHtml from "sanitize-html";

// ------------------------------------
// Types & Interfaces
export interface BrickConfig {}

export type FieldTypes =
  | "tab"
  | "text"
  | "wysiwyg"
  | "image"
  | "file"
  | "repeater"
  | "number"
  | "checkbox"
  | "select"
  | "textarea"
  | "json"
  | "colour"
  | "datetime"
  | "pagelink"
  | "link";

export enum FieldTypesEnum {
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
  Link = "link",
}

export type BrickBuilderT = InstanceType<typeof BrickBuilder>;

// Custom Fields
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
  // Validation
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

const baseCustomFieldSchema = z.object({
  type: z.string(),
  key: z.string(),
  title: z.string(),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  // boolean or string
  default: z.union([z.boolean(), z.string()]).optional(),
  options: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .optional(),
  validation: z
    .object({
      zod: z.any().optional(),
      required: z.boolean().optional(),
      extensions: z.array(z.string()).optional(),
      width: z
        .object({
          min: z.number().optional(),
          max: z.number().optional(),
        })
        .optional(),
      height: z
        .object({
          min: z.number().optional(),
          max: z.number().optional(),
        })
        .optional(),
    })
    .optional(),
});
export type Fields = z.infer<typeof baseCustomFieldSchema> & {
  fields?: Fields[];
};
const customFieldSchemaObject: z.ZodType<Fields> = baseCustomFieldSchema.extend(
  {
    fields: z.lazy(() => customFieldSchemaObject.array().optional()),
  }
);
// const customFieldSchema = customFieldSchemaObject.array();

// ------------------------------------
// Validate
export interface ValidationResponse {
  valid: boolean;
  message?: string;
}

// ------------------------------------
// Custom Fields Config
export interface CustomFieldConfig {
  key: string;
  title?: string;
  description?: string;
  validation?: {
    required?: boolean;
  };
}

// text field
export interface TabConfig extends CustomFieldConfig {}
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
  options: Array<{ label: string; value: string }>;
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

export type FieldConfigs =
  | TabConfig
  | TextConfig
  | WysiwygConfig
  | ImageConfig
  | NumberConfig
  | CheckboxConfig
  | SelectConfig
  | TextareaConfig
  | JSONConfig
  | FileConfig
  | ColourConfig
  | DateTimeConfig
  | PageLinkConfig;

// ------------------------------------
// BrickBuilder
const BrickBuilder = class BrickBuilder {
  key: string;
  title: string;
  fields: Map<string, CustomField> = new Map();
  repeaterStack: string[] = [];
  maxRepeaterDepth: number = 5;
  constructor(key: string, config?: BrickConfig) {
    this.key = key;
    this.title = this.#keyToTitle(key);
  }
  // ------------------------------------
  // Methods
  public addFields(BrickBuilder: BrickBuilder) {
    const fields = BrickBuilder.fields;
    fields.forEach((field) => {
      this.#checkKeyDuplication(field.key);
      this.fields.set(field.key, field);
    });
    return this;
  }
  public endRepeater() {
    // pop the last added repeater from the stack
    const key = this.repeaterStack.pop();

    if (!key) {
      throw new Error("No open repeater to end.");
    }

    const fields = Array.from(this.fields.values());
    let selectedRepeaterIndex = 0;
    let repeaterKey = "";

    // find the selected repeater
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].type === "repeater" && fields[i].key === key) {
        selectedRepeaterIndex = i;
        repeaterKey = fields[i].key;
        break;
      }
    }

    if (!repeaterKey) {
      throw new Error(`Repeater with key "${key}" does not exist.`);
    }

    const fieldsAfterSelectedRepeater = fields.slice(selectedRepeaterIndex + 1);
    const repeater = this.fields.get(repeaterKey);
    if (repeater) {
      // filter out tab fields
      repeater.fields = fieldsAfterSelectedRepeater.filter(
        (field) => field.type !== "tab"
      );
      fieldsAfterSelectedRepeater.map((field) => {
        this.fields.delete(field.key);
      });
    }

    return this;
  }
  // ------------------------------------
  // Custom Fields
  public addTab(config: TabConfig) {
    this.#checkKeyDuplication(config.key);
    this.#addToFields("tab", config);
    return this;
  }
  public addText = (config: TextConfig) => {
    this.#checkKeyDuplication(config.key);
    this.#addToFields("text", config);
    return this;
  };
  public addWysiwyg(config: WysiwygConfig) {
    this.#checkKeyDuplication(config.key);
    this.#addToFields("wysiwyg", config);
    return this;
  }
  public addImage(config: ImageConfig) {
    this.#checkKeyDuplication(config.key);
    this.#addToFields("image", config);
    return this;
  }
  public addRepeater(config: RepeaterConfig) {
    this.#checkKeyDuplication(config.key);
    // check the current depth of nested repeaters
    if (this.repeaterStack.length >= this.maxRepeaterDepth) {
      throw new Error(
        `Maximum repeater depth of ${this.maxRepeaterDepth} exceeded.`
      );
    }
    this.#addToFields("repeater", config);
    // whenever a new repeater is added, push it to the repeater stack
    this.repeaterStack.push(config.key);
    return this;
  }
  public addNumber(config: NumberConfig) {
    this.#checkKeyDuplication(config.key);
    this.#addToFields("number", config);
    return this;
  }
  public addCheckbox(config: CheckboxConfig) {
    this.#checkKeyDuplication(config.key);
    this.#addToFields("checkbox", config);
    return this;
  }
  public addSelect(config: SelectConfig) {
    this.#checkKeyDuplication(config.key);
    this.#addToFields("select", config);
    return this;
  }
  public addTextarea(config: TextareaConfig) {
    this.#checkKeyDuplication(config.key);
    this.#addToFields("textarea", config);
    return this;
  }
  public addJSON(config: JSONConfig) {
    this.#checkKeyDuplication(config.key);
    this.#addToFields("json", config);
    return this;
  }
  public addFile(config: FileConfig) {
    this.#checkKeyDuplication(config.key);
    this.#addToFields("file", config);
    return this;
  }
  public addColour(config: ColourConfig) {
    this.#checkKeyDuplication(config.key);
    this.#addToFields("colour", config);
    return this;
  }
  public addDateTime(config: DateTimeConfig) {
    this.#checkKeyDuplication(config.key);
    this.#addToFields("datetime", config);
    return this;
  }
  public addPageLink(config: PageLinkConfig) {
    this.#checkKeyDuplication(config.key);
    this.#addToFields("pagelink", config);
    return this;
  }
  public addLink(config: LinkConfig) {
    this.#checkKeyDuplication(config.key);
    this.#addToFields("link", config);
    return this;
  }
  // ------------------------------------
  // Getters
  get fieldTree() {
    // everything between two tabs should get removed and added to the tab fields array
    const fields = Array.from(this.fields.values());

    let result: Array<CustomField> = [];
    let currentTab: CustomField | null = null;

    fields.forEach((item) => {
      if (item.type === "tab") {
        if (currentTab) {
          result.push(currentTab);
        }
        currentTab = { ...item, fields: [] };
      } else if (currentTab) {
        if (!currentTab.fields) currentTab.fields = [];
        currentTab.fields.push(item);
      } else {
        result.push(item);
      }
    });

    if (currentTab) {
      result.push(currentTab);
    }

    return result;
  }
  get basicFieldTree() {
    const fieldArray = Array.from(this.fields.values());
    // return fields minus tab
    fieldArray.forEach((field) => {
      if (field.type === "tab") {
        fieldArray.splice(fieldArray.indexOf(field), 1);
      }
    });
    return fieldArray;
  }
  get flatFields() {
    const fields: CustomField[] = [];

    const fieldArray = Array.from(this.fields.values());
    const getFields = (field: CustomField) => {
      fields.push(field);
      if (field.type === "repeater") {
        field.fields?.forEach((item) => {
          getFields(item);
        });
      }
    };

    fieldArray.forEach((field) => {
      getFields(field);
    });

    return fields;
  }
  // ------------------------------------
  // Field Type Validation
  fieldValidation({
    type,
    key,
    value,
    secondaryValue,
  }: {
    type: string;
    key: string;
    value: any;
    secondaryValue?: any;
  }): ValidationResponse {
    const field = this.flatFields.find((item) => item.key === key);
    if (!field) {
      return {
        valid: false,
        message: `Field with key "${key}" does not exist.`,
      };
    }
    // Check if field type is text
    const typeValidation = this.#validateType(type, field.type);
    if (!typeValidation.valid) {
      return typeValidation;
    }

    // Check if field is required
    if (field.validation?.required) {
      const requiredValidation = this.#validateRequired(value);
      if (!requiredValidation.valid) {
        return requiredValidation;
      }
    }

    // run zod validation
    if (field.validation?.zod && field.type !== "wysiwyg") {
      const zodValidation = this.#validateZodSchema(
        field.validation.zod,
        value
      );
      if (!zodValidation.valid) {
        return zodValidation;
      }
    }

    // Validate string
    if (
      field.type === "text" ||
      field.type === "textarea" ||
      field.type === "colour" ||
      field.type === "datetime" ||
      field.type === "link" ||
      field.type === "wysiwyg" ||
      field.type === "select"
    ) {
      const stringValidation = this.#validateIsString(value);
      if (!stringValidation.valid) {
        return stringValidation;
      }
    }

    // Validate number
    if (field.type === "number" || field.type === "pagelink") {
      const numberValidation = this.#validateIsNumber(value);
      if (!numberValidation.valid) {
        return numberValidation;
      }
    }

    // Validate boolean
    if (field.type === "checkbox") {
      const checkboxValidation = this.#validateIsBoolean(value);
      if (!checkboxValidation.valid) {
        return checkboxValidation;
      }
    }

    // Field specific validation
    switch (field.type) {
      case "select": {
        const selectTypeValidation = this.#validateSelectType(field, {
          type,
          key,
          value,
        });
        if (!selectTypeValidation.valid) {
          return selectTypeValidation;
        }
        break;
      }
      case "wysiwyg": {
        const wysiwygTypeValidation = this.#validateWysiwygType(field, {
          type,
          key,
          value,
        });
        if (!wysiwygTypeValidation.valid) {
          return wysiwygTypeValidation;
        }
        break;
      }
      case "image": {
        const imageTypeValidation = this.#validateImageType(field, {
          type,
          key,
          value,
        });
        if (!imageTypeValidation.valid) {
          return imageTypeValidation;
        }
        break;
      }
      case "file": {
        const fileTypeValidation = this.#validateFileType(field, {
          type,
          key,
          value,
        });
        if (!fileTypeValidation.valid) {
          return fileTypeValidation;
        }
        break;
      }
      case "datetime": {
        const datetimeTypeValidation = this.#validateDatetimeType({
          type,
          key,
          value,
        });
        if (!datetimeTypeValidation.valid) {
          return datetimeTypeValidation;
        }
        break;
      }
      case "link": {
        if (secondaryValue) {
          const tagetValidation = this.#validateLinkTarget(secondaryValue);
          if (!tagetValidation.valid) {
            return tagetValidation;
          }
        }
        break;
      }
      case "pagelink": {
        if (secondaryValue) {
          const tagetValidation = this.#validateLinkTarget(secondaryValue);
          if (!tagetValidation.valid) {
            return tagetValidation;
          }
        }
        break;
      }
    }

    return {
      valid: true,
    };
  }
  // ------------------------------------
  #validateSelectType(
    field: CustomField,
    {
      type,
      key,
      value,
    }: {
      type: string;
      key: string;
      value: string;
    }
  ): ValidationResponse {
    // Check if value is in the options
    if (field.options) {
      const optionValues = field.options.map((option) => option.value);
      if (!optionValues.includes(value)) {
        return {
          valid: false,
          message: "Value must be one of the provided options.",
        };
      }
    }

    return {
      valid: true,
    };
  }
  #validateWysiwygType(
    field: CustomField,
    {
      type,
      key,
      value,
    }: {
      type: string;
      key: string;
      value: string;
    }
  ): ValidationResponse {
    const sanitizedValue = sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {},
    });

    // run zod validation
    if (field.validation?.zod) {
      const zodValidation = this.#validateZodSchema(
        field.validation.zod,
        sanitizedValue
      );
      if (!zodValidation.valid) {
        return zodValidation;
      }
    }

    return {
      valid: true,
    };
  }
  #validateImageType(
    field: CustomField,
    {
      type,
      key,
      value,
    }: {
      type: string;
      key: string;
      value: string;
    }
  ): ValidationResponse {
    // TODO: add validation for extensions and max/min size
    return {
      valid: true,
    };
  }
  #validateFileType(
    field: CustomField,
    {
      type,
      key,
      value,
    }: {
      type: string;
      key: string;
      value: string;
    }
  ): ValidationResponse {
    // TODO: add validation for extensions
    return {
      valid: true,
    };
  }
  #validateDatetimeType({
    type,
    key,
    value,
  }: {
    type: string;
    key: string;
    value: string;
  }): ValidationResponse {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return {
        valid: false,
        message: "Value must be a valid date.",
      };
    }
    return {
      valid: true,
    };
  }
  #validateLinkTarget(value: string): ValidationResponse {
    const allowedValues = ["_self", "_blank"];
    if (!allowedValues.includes(value)) {
      return {
        valid: false,
        message: "Target must be _self or _blank.",
      };
    }
    return {
      valid: true,
    };
  }
  // ------------------------------------
  // Validation Util
  #validateRequired(value: any): ValidationResponse {
    if (value === undefined || value === null || value === "") {
      return {
        valid: false,
        message: "This field is required.",
      };
    }
    return {
      valid: true,
    };
  }
  #validateType(providedType: string, type: FieldTypes): ValidationResponse {
    if (providedType !== type) {
      return {
        valid: false,
        message: `Field type must be "${type}".`,
      };
    }
    return {
      valid: true,
    };
  }
  #validateZodSchema(schema: z.ZodSchema<any>, value: any): ValidationResponse {
    try {
      schema.parse(value);
      return {
        valid: true,
      };
    } catch (error) {
      const err = error as z.ZodError;
      return {
        valid: false,
        message: err.issues[0].message,
      };
    }
  }
  #validateIsString(value: any): ValidationResponse {
    if (typeof value !== "string") {
      return {
        valid: false,
        message: "Value must be a string.",
      };
    }
    return {
      valid: true,
    };
  }
  #validateIsNumber(value: any): ValidationResponse {
    if (typeof value !== "number") {
      return {
        valid: false,
        message: "Value must be a number.",
      };
    }
    return {
      valid: true,
    };
  }
  #validateIsBoolean(value: any): ValidationResponse {
    if (typeof value !== "boolean") {
      return {
        valid: false,
        message: "Value must be a boolean.",
      };
    }
    return {
      valid: true,
    };
  }
  // ------------------------------------
  // Private Methods
  #keyToTitle(key: string) {
    if (typeof key !== "string") return key;

    const title = key
      .split(/[-_]/g) // split on hyphen or underscore
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize each word
      .join(" "); // rejoin words with space

    return title;
  }
  #addToFields(type: FieldTypes, config: FieldConfigs) {
    const noUndefinedConfig = Object.keys(config).reduce((acc, key) => {
      // @ts-ignore
      if (config[key] !== undefined) {
        // @ts-ignore
        acc[key] = config[key];
      }
      return acc;
    }, {});

    const data = {
      type: type,
      title: config.title || this.#keyToTitle(config.key),
      ...(noUndefinedConfig as CustomFieldConfig),
    };

    const validation = baseCustomFieldSchema.safeParse(data);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }

    this.fields.set(config.key, data);
  }
  #checkKeyDuplication(key: string) {
    if (this.fields.has(key)) {
      throw new Error(`Field with key "${key}" already exists.`);
    }
  }
};

// const bannerBrick = new BrickBuilder("banner")
//   .addTab({
//     key: "content_tab",
//   })
//   .addText({
//     key: "title",
//     description: "The title of the banner",
//     validation: {
//       zod: z.string().min(3).max(10),
//     },
//   })
//   .addWysiwyg({
//     key: "description",
//   })
//   .addRepeater({
//     key: "links",
//     validation: {
//       max: 3,
//     },
//   })
//   .addText({
//     key: "image_alt",
//     validation: {
//       zod: z.string().min(3).max(10),
//     },
//   })
//   .addImage({
//     key: "image",
//   })
//   .endRepeater()
//   .addWysiwyg({
//     key: "description_last",
//   })
//   .addTab({
//     key: "general-2",
//   })
//   .addText({
//     key: "title-2",
//     description: "The title of the banner",
//   });

// // @ts-ignore
// console.log(bannerBrick.fieldTree[0].fields);

// const valid = bannerBrick.validateTextType({
//   type: "text",
//   key: "image_alt",
//   value: "hello",
// });
// console.log(valid);

export default BrickBuilder;
