import z from "zod";
import type { MediaTypeT } from "@headless/types/src/media.js";

export interface BrickConfigT {
	title?: string;
	preview?: {
		image?: string;
	};
}

interface CustomFieldT {
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
		zod?: z.ZodType<unknown>;
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
		zod?: z.ZodType<unknown>;
	};
}
export interface WysiwygConfigT extends CustomFieldConfigT {
	default?: string;
	placeholder?: string;
	validation?: {
		required?: boolean;
		zod?: z.ZodType<unknown>;
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
		zod?: z.ZodType<unknown>;
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
		zod?: z.ZodType<unknown>;
	};
}
export interface JSONConfigT extends CustomFieldConfigT {
	default?: {
		[key: string]: unknown;
	};
	placeholder?: string;
	validation?: {
		required?: boolean;
		zod?: z.ZodType<unknown>;
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
	| PageLinkConfigT["default"]
	| LinkConfigT["default"];
