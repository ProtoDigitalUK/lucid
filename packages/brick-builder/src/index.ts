import z from "zod";

// ------------------------------------
// Types & Interfaces
interface BrickConfig {}

type FieldTypes =
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
  | "json";

type BrickBuilderT = InstanceType<typeof BrickBuilder>;

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
  // ------------------------------------
  // External Methods
  public static validateBrickData(data: any) {
    // TODO: add route to verify data added against brick to its field configs
    return true;
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

// // @ts-ignore
// console.log(bannerBrick.fieldTree);

export { BrickBuilderT, CustomField, FieldTypes };
export default BrickBuilder;
