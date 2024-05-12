import type { ZodType } from "zod";
import type { MediaType } from "../../../types/response.js";

export interface CustomField {
	type: FieldTypes;
	key: string;
	repeaterKey?: string;
	title?: string;
	description?: string;
	placeholder?: string;
	default?: DefaultFieldValues;
	translations?: boolean;

	fields?: Array<CustomField>;

	hidden?: boolean;
	disabled?: boolean;

	presets?: string[];
	copy?: {
		true?: string;
		false?: string;
	};
	options?: Array<{
		label: string;
		value: string;
	}>;
	validation?: {
		zod?: ZodType<unknown>;
		required?: boolean;
		extensions?: string[];
		type?: MediaType;
		maxGroups?: number;
		width?: {
			min?: number;
			max?: number;
		};
		height?: {
			min?: number;
			max?: number;
		};
	};
	collection?: {
		list: true;
		filterable: true;
	};
}

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
	| "link"
	| "user";

export interface FieldBuilderMeta {
	fieldKeys: string[];
	repeaterDepth: Record<string, number>;
}

// ----------------------------------------------
// Custom Field Builder Config

export interface CustomFieldConfig {
	key: string;
	title?: string;
	description?: string;
}

export type CustomFieldConfigs =
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
	| LinkConfig
	| RepeaterConfig
	| UserConfig;

export interface TabConfig extends CustomFieldConfig {
	title: string;
}
export interface TextConfig extends CustomFieldConfig {
	default?: string;
	placeholder?: string;
	hidden?: boolean;
	disabled?: boolean;
	translations?: boolean;
	validation?: {
		required?: boolean;
		zod?: ZodType<unknown>;
	};
}
export interface WysiwygConfig extends CustomFieldConfig {
	default?: string;
	placeholder?: string;
	hidden?: boolean;
	disabled?: boolean;
	translations?: boolean;
	validation?: {
		required?: boolean;
		zod?: ZodType<unknown>;
	};
}
export interface MediaConfig extends CustomFieldConfig {
	hidden?: boolean;
	disabled?: boolean;
	translations?: boolean;
	validation?: {
		required?: boolean;
		extensions?: string[];
		type?: "image" | "video" | "document" | "archive";
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
		maxGroups?: number;
	};
}
export interface NumberConfig extends CustomFieldConfig {
	default?: number | null;
	placeholder?: string;
	hidden?: boolean;
	disabled?: boolean;
	translations?: boolean;
	validation?: {
		required?: boolean;
		zod?: ZodType<unknown>;
	};
}
export interface CheckboxConfig extends CustomFieldConfig {
	default?: boolean;
	hidden?: boolean;
	disabled?: boolean;
	translations?: boolean;
	copy?: {
		true?: string;
		false?: string;
	};
}
export interface SelectConfig extends CustomFieldConfig {
	default?: string;
	placeholder?: string;
	hidden?: boolean;
	disabled?: boolean;
	translations?: boolean;
	options: Array<{ label: string; value: string }>;
	validation?: {
		required?: boolean;
	};
}
export interface TextareaConfig extends CustomFieldConfig {
	default?: string;
	placeholder?: string;
	hidden?: boolean;
	disabled?: boolean;
	translations?: boolean;
	validation?: {
		required?: boolean;
		zod?: ZodType<unknown>;
	};
}
export interface JSONConfig extends CustomFieldConfig {
	default?: {
		[key: string]: unknown;
	};
	placeholder?: string;
	hidden?: boolean;
	disabled?: boolean;
	translations?: boolean;
	validation?: {
		required?: boolean;
		zod?: ZodType<unknown>;
	};
}
export interface ColourConfig extends CustomFieldConfig {
	default?: string;
	presets?: string[];
	hidden?: boolean;
	disabled?: boolean;
	translations?: boolean;
	validation?: {
		required?: boolean;
	};
}
export interface DateTimeConfig extends CustomFieldConfig {
	default?: string;
	placeholder?: string;
	hidden?: boolean;
	disabled?: boolean;
	translations?: boolean;
	validation?: {
		required?: boolean;
	};
}
export interface LinkConfig extends CustomFieldConfig {
	default?: string;
	placeholder?: string;
	hidden?: boolean;
	disabled?: boolean;
	translations?: boolean;
	validation?: {
		required?: boolean;
	};
}

export interface UserConfig extends CustomFieldConfig {
	hidden?: boolean;
	disabled?: boolean;
	translations?: boolean;
	validation?: {
		required?: boolean;
	};
}

// Defaults
export type DefaultFieldValues =
	| TextConfig["default"]
	| WysiwygConfig["default"]
	| NumberConfig["default"]
	| CheckboxConfig["default"]
	| SelectConfig["default"]
	| TextareaConfig["default"]
	| JSONConfig["default"]
	| ColourConfig["default"]
	| DateTimeConfig["default"]
	| LinkConfig["default"];

// Validation
export interface ValidationProps {
	type: FieldTypes;
	key: string;
	value: unknown;
	referenceData?: MediaReferenceData | LinkReferenceData | UserReferenceData;
	flatFieldConfig: CustomField[];
}
export interface ValidationResponse {
	valid: boolean;
	message?: string;
}

export interface LinkReferenceData {
	target?: string | null;
	label?: string | null;
}

export interface MediaReferenceData {
	extension: string;
	width: number | null;
	height: number | null;
	type: string;
}

export interface UserReferenceData {
	username: string;
	firstName: string | null;
	lastName: string | null;
	email: string;
}
