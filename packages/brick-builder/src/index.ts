import z from "zod";

// ------------------------------------
// Types & Interfaces
interface BricConfig {}

type FieldTypes =
  | "tab"
  | "group"
  | "text"
  | "wysiwyg"
  | "image"
  | "repeater"
  | "number"
  | "checkbox"
  | "select"
  | "textarea"
  | "json";

// Custom Fields
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

const baseCustomFieldSchema = z.object({
  type: z.string(),
  key: z.string(),
  title: z.string(),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  validate: z.function().optional(),
  pattern: z.string().optional(),
});
type Fields = z.infer<typeof baseCustomFieldSchema> & {
  fields?: Fields[];
};
const customFieldSchemaObject: z.ZodType<Fields> = baseCustomFieldSchema.extend(
  {
    fields: z.lazy(() => customFieldSchemaObject.array().optional()),
  }
);
// const customFieldSchema = customFieldSchemaObject.array();

// ------------------------------------
// Custom Fields Config
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

// text field
interface TabConfig extends CustomFieldConfig {}
interface TextConfig extends CustomFieldConfig {
  pattern?: string;
}
interface WysiwygConfig extends CustomFieldConfig {}
interface ImageConfig extends CustomFieldConfig {}
interface RepeaterConfig extends CustomFieldConfig {}
interface NumberConfig extends CustomFieldConfig {}
interface CheckboxConfig extends CustomFieldConfig {}
interface SelectConfig extends CustomFieldConfig {
  options: Array<{ label: string; value: string }>;
}
interface TextareaConfig extends CustomFieldConfig {}
interface JSONConfig extends CustomFieldConfig {}

type FieldConfigs =
  | TabConfig
  | TextConfig
  | WysiwygConfig
  | ImageConfig
  | NumberConfig
  | CheckboxConfig
  | SelectConfig
  | TextareaConfig
  | JSONConfig;

// ------------------------------------
// BrickBuilder
const BrickBuilder = class BrickBuilder {
  key: string;
  title: string;
  fields: Map<string, CustomField> = new Map();
  constructor(key: string, config?: BricConfig) {
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
    const fields = Array.from(this.fields.values());
    let lastRepeaterIndex = 0;
    let repeaterKey = "";
    // get last repeater index from map
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].type === "repeater") {
        lastRepeaterIndex = i;
        repeaterKey = fields[i].key;
      }
    }

    const fieldsAfterLastRepeater = fields.slice(lastRepeaterIndex + 1);
    const repeater = this.fields.get(repeaterKey);
    if (repeater) {
      repeater.fields = fieldsAfterLastRepeater;
      fieldsAfterLastRepeater.map((field) => {
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
    this.#addToFields("repeater", config);
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
  // ------------------------------------
  // Getters
  get fieldTree() {
    // everything between two tabs should get removed and added to the tab fields array
    const fields = Array.from(this.fields.values());
    const fieldTree = fields.reduce((acc, field) => {
      if (field.type === "tab") {
        acc.push(field);
      } else {
        const lastTab = acc[acc.length - 1];
        if (lastTab) {
          if (!lastTab.fields) {
            lastTab.fields = [];
          }
          lastTab.fields.push(field);
        }
      }
      return acc;
    }, [] as Array<CustomField>);
    return fieldTree;
  }
  // ------------------------------------
  // External Methods
  public validateBrick() {
    // TODO: add route to verify data added against brick to its field configs
  }
  // ------------------------------------
  // Private Methods
  #keyToTitle(key: string) {
    if (typeof key !== "string") return key;
    return key.replace(/-/g, " ").replace(/\w\S*/g, (w) => {
      return w.replace(/^\w/, (c) => c.toUpperCase());
    });
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
//     key: "general",
//   })
//   .addText({
//     key: "title",
//     description: "The title of the banner",
//     validate: (value) => {
//       const v = value as string;
//       if (v.length > 10) {
//         return "Title must be less than 10 characters";
//       }
//       return "";
//     },
//   })
//   .addWysiwyg({
//     key: "description",
//   })
//   .addRepeater({
//     key: "links",
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

// console.log(bannerBrick.fieldTree);

export default BrickBuilder;
