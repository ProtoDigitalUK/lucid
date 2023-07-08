import z from "zod";

// ------------------------------------
// Types & Interfaces
export interface BrickConfig {}

export type FieldTypes =
  | "tab"
  | "text"
  | "wysiwyg"
  | "media"
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
  Media = "media",
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

// Custom Fields - fields define in the builder
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

// ------------------------------------
// Validation types
export interface ValidationProps {
  type: FieldTypes;
  key: CustomFieldConfig["key"];
  value: any;
  referenceData?: MediaReferenceData | LinkReferenceData;
  flatFieldConfig: CustomField[];
}
export interface ValidationResponse {
  valid: boolean;
  message?: string;
}

export interface LinkReferenceData {
  target: string;
}

export interface MediaReferenceData {
  extension: string;
  width: number | null;
  height: number | null;
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
export interface MediaConfig extends CustomFieldConfig {
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
  | MediaConfig
  | NumberConfig
  | CheckboxConfig
  | SelectConfig
  | TextareaConfig
  | JSONConfig
  | ColourConfig
  | DateTimeConfig
  | PageLinkConfig;
