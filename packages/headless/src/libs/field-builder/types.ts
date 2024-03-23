import type { ZodType } from "zod";
import type { MediaTypeT } from "@headless/types/src/media.js";

export interface CustomFieldT {
	type: FieldTypesT;
	key: string;
	repeaterKey?: string;
	title?: string;
	description?: string;
	placeholder?: string;
	default?: DefaultFieldValuesT;

	fields?: Array<CustomFieldT>;

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
		type?: MediaTypeT;
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
}

export type FieldTypesT =
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

export enum FieldTypesEnumT {
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

export interface FieldBuilderMetaT {
	fieldKeys: string[];
	repeaterDepth: Record<string, number>;
}

// ----------------------------------------------
// Custom Field Builder Config

export interface CustomFieldConfigT {
	key: string;
	title?: string;
	description?: string;
}

export type CustomFieldConfigsT =
	| TabConfigT
	| TextConfigT
	| WysiwygConfigT
	| MediaConfigT
	| NumberConfigT
	| CheckboxConfigT
	| SelectConfigT
	| TextareaConfigT
	| JSONConfigT
	| ColourConfigT
	| DateTimeConfigT
	| PageLinkConfigT
	| LinkConfigT
	| RepeaterConfigT;

export interface TabConfigT extends CustomFieldConfigT {
	title: string;
}
export interface TextConfigT extends CustomFieldConfigT {
	default?: string;
	placeholder?: string;
	validation?: {
		required?: boolean;
		zod?: ZodType<unknown>;
	};
}
export interface WysiwygConfigT extends CustomFieldConfigT {
	default?: string;
	placeholder?: string;
	validation?: {
		required?: boolean;
		zod?: ZodType<unknown>;
	};
}
export interface MediaConfigT extends CustomFieldConfigT {
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
export interface RepeaterConfigT extends CustomFieldConfigT {
	validation?: {
		maxGroups?: number;
	};
}
export interface NumberConfigT extends CustomFieldConfigT {
	default?: number | null;
	placeholder?: string;
	validation?: {
		required?: boolean;
		zod?: ZodType<unknown>;
	};
}
export interface CheckboxConfigT extends CustomFieldConfigT {
	default?: boolean;
	copy?: {
		true?: string;
		false?: string;
	};
}
export interface SelectConfigT extends CustomFieldConfigT {
	default?: string;
	placeholder?: string;

	options: Array<{ label: string; value: string }>;
	validation?: {
		required?: boolean;
	};
}
export interface TextareaConfigT extends CustomFieldConfigT {
	default?: string;
	placeholder?: string;
	validation?: {
		required?: boolean;
		zod?: ZodType<unknown>;
	};
}
export interface JSONConfigT extends CustomFieldConfigT {
	default?: {
		[key: string]: unknown;
	};
	placeholder?: string;
	validation?: {
		required?: boolean;
		zod?: ZodType<unknown>;
	};
}
export interface ColourConfigT extends CustomFieldConfigT {
	default?: string;
	presets?: string[];
	validation?: {
		required?: boolean;
	};
}
export interface DateTimeConfigT extends CustomFieldConfigT {
	default?: string;
	placeholder?: string;
	validation?: {
		required?: boolean;
	};
}
export interface PageLinkConfigT extends CustomFieldConfigT {
	validation?: {
		required?: boolean;
	};
}
export interface LinkConfigT extends CustomFieldConfigT {
	default?: string;
	placeholder?: string;
	validation?: {
		required?: boolean;
	};
}

// Defaults
export type DefaultFieldValuesT =
	| TextConfigT["default"]
	| WysiwygConfigT["default"]
	| NumberConfigT["default"]
	| CheckboxConfigT["default"]
	| SelectConfigT["default"]
	| TextareaConfigT["default"]
	| JSONConfigT["default"]
	| ColourConfigT["default"]
	| DateTimeConfigT["default"]
	| LinkConfigT["default"];

// Validation
export interface ValidationPropsT {
	type: FieldTypesT;
	key: string;
	value: unknown;
	referenceData?: MediaReferenceDataT | LinkReferenceDataT;
	flatFieldConfig: CustomFieldT[];
}
export interface ValidationResponseT {
	valid: boolean;
	message?: string;
}

export interface LinkReferenceDataT {
	target?: string | null;
	label?: string | null;
}

export interface MediaReferenceDataT {
	extension: string;
	width: number | null;
	height: number | null;
	type: string;
}
