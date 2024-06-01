import type { ZodType } from "zod";
import type { MediaType } from "../../types/response.js";
import type { BooleanInt } from "../db/types.js";

// -----------------------------------------------
// Shared
export type TranslationValue = Record<string, string> | string;

// -----------------------------------------------
// Custom Field
export type CustomFieldMap = {
	tab: {
		props: TabFieldProps;
		config: TabFieldConfig;
		column: null;
		response: {
			value: TabResValue;
			meta: TabResMeta;
		};
	};
	text: {
		props: TextFieldProps;
		config: TextFieldConfig;
		column: "text_value";
		response: {
			value: TextResValue;
			meta: TextResMeta;
		};
	};
	wysiwyg: {
		props: WysiwygFieldProps;
		config: WysiwygFieldConfig;
		column: "text_value";
		response: {
			value: WysiwygResValue;
			meta: WysiwygResMeta;
		};
	};
	media: {
		props: MediaFieldProps;
		config: MediaFieldConfig;
		column: "media_id";
		response: {
			value: MediaResValue;
			meta: MediaResMeta;
		};
	};
	repeater: {
		props: RepeaterFieldProps;
		config: RepeaterFieldConfig;
		column: null;
		response: {
			value: RepeaterResValue;
			meta: RepeaterResMeta;
		};
	};
	number: {
		props: NumberFieldProps;
		config: NumberFieldConfig;
		column: "int_value";
		response: {
			value: NumberResValue;
			meta: NumberResMeta;
		};
	};
	checkbox: {
		props: CheckboxFieldProps;
		config: CheckboxFieldConfig;
		column: "bool_value";
		response: {
			value: CheckboxResValue;
			meta: CheckboxResMeta;
		};
	};
	select: {
		props: SelectFieldProps;
		config: SelectFieldConfig;
		column: "text_value";
		response: {
			value: SelectReValue;
			meta: SelectResMeta;
		};
	};
	textarea: {
		props: TextareaFieldProps;
		config: TextareaFieldConfig;
		column: "text_value";
		response: {
			value: TextareaResValue;
			meta: TextareaResMeta;
		};
	};
	json: {
		props: JsonFieldProps;
		config: JsonFieldConfig;
		column: "json_value";
		response: {
			value: JsonResValue;
			meta: JsonResMeta;
		};
	};
	colour: {
		props: ColourFieldProps;
		config: ColourFieldConfig;
		column: "text_value";
		response: {
			value: ColourResValue;
			meta: ColourResMeta;
		};
	};
	datetime: {
		props: DatetimeFieldProps;
		config: DatetimeFieldConfig;
		column: "text_value";
		response: {
			value: DatetimeResValue;
			meta: DatetimeResMeta;
		};
	};
	link: {
		props: LinkFieldProps;
		config: LinkFieldConfig;
		column: "text_value";
		response: {
			value: LinkResValue;
			meta: LinkResMeta;
		};
	};
	user: {
		props: UserFieldProps;
		config: UserFieldConfig;
		column: "user_id";
		response: {
			value: UserResValue;
			meta: UserResMeta;
		};
	};
};
export type FieldTypes = keyof CustomFieldMap;
export type FieldColumns =
	| "text_value"
	| "media_id"
	| "int_value"
	| "bool_value"
	| "json_value"
	| "user_id";

// -----------------------------------------------
// Generic Types
export type CFConfig<T extends FieldTypes> = CustomFieldMap[T]["config"];
export type CFProps<T extends FieldTypes> = CustomFieldMap[T]["props"];
export type CFColumn<T extends FieldTypes> = CustomFieldMap[T]["column"];
export type CFResponse<T extends FieldTypes> = CustomFieldMap[T]["response"];

// -----------------------------------------------
// Custom Field Config

export type SharedFieldConfig = {
	key: string;
	type: FieldTypes;

	labels: {
		title?: TranslationValue;
		description?: TranslationValue;
	};
};

export interface TabFieldConfig extends SharedFieldConfig {
	type: "tab";

	labels: {
		title?: TranslationValue;
		description?: TranslationValue;
	};
	fields: Exclude<CFConfig<FieldTypes>, TabFieldConfig>[];
}
export interface TextFieldConfig extends SharedFieldConfig {
	type: "text";

	labels: {
		title?: TranslationValue;
		description?: TranslationValue;
		placeholder?: TranslationValue;
	};

	translations: boolean;
	default: string;
	hidden?: boolean;
	disabled?: boolean;

	validation?: {
		required?: boolean;
		zod?: ZodType<unknown> | undefined;
	};
}
export interface WysiwygFieldConfig extends SharedFieldConfig {
	type: "wysiwyg";

	labels: {
		title?: TranslationValue;
		description?: TranslationValue;
		placeholder?: TranslationValue;
	};

	translations: boolean;
	default: string;
	hidden?: boolean;
	disabled?: boolean;

	validation?: {
		required?: boolean;
		zod?: ZodType<unknown> | undefined;
	};
}
export interface MediaFieldConfig extends SharedFieldConfig {
	type: "media";

	labels: {
		title?: TranslationValue;
		description?: TranslationValue;
	};

	translations: boolean;
	hidden?: boolean;
	disabled?: boolean;

	validation?: {
		required?: boolean;
		extensions?: string[];
		type?: MediaType;
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
export interface RepeaterFieldConfig extends SharedFieldConfig {
	type: "repeater";
	fields: Exclude<CFConfig<FieldTypes>, TabFieldConfig>[];
	labels: {
		title?: TranslationValue;
		description?: TranslationValue;
	};
	validation?: {
		maxGroups?: number;
	};
}
export interface NumberFieldConfig extends SharedFieldConfig {
	type: "number";

	labels: {
		title?: TranslationValue;
		description?: TranslationValue;
		placeholder?: TranslationValue;
	};

	translations: boolean;
	hidden?: boolean;
	disabled?: boolean;
	default?: number | null;

	validation?: {
		required?: boolean;
		zod?: ZodType<unknown>;
	};
}
export interface CheckboxFieldConfig extends SharedFieldConfig {
	type: "checkbox";

	labels: {
		title?: TranslationValue;
		description?: TranslationValue;
		true?: TranslationValue;
		false?: TranslationValue;
	};

	translations: boolean;
	hidden?: boolean;
	disabled?: boolean;
	default?: BooleanInt;

	validation?: {
		required?: boolean;
	};
}
export interface SelectFieldConfig extends SharedFieldConfig {
	type: "select";

	labels: {
		title?: TranslationValue;
		description?: TranslationValue;
		placeholder?: TranslationValue;
	};
	options: Array<{ label: TranslationValue; value: string }>;

	translations: boolean;
	hidden?: boolean;
	disabled?: boolean;
	default?: string;

	validation?: {
		required?: boolean;
	};
}
export interface TextareaFieldConfig extends SharedFieldConfig {
	type: "textarea";

	labels: {
		title?: TranslationValue;
		description?: TranslationValue;
		placeholder?: TranslationValue;
	};

	translations: boolean;
	hidden?: boolean;
	disabled?: boolean;
	default?: string;

	validation?: {
		required?: boolean;
		zod?: ZodType<unknown>;
	};
}
export interface JsonFieldConfig extends SharedFieldConfig {
	type: "json";

	labels: {
		title?: TranslationValue;
		description?: TranslationValue;
		placeholder?: TranslationValue;
	};

	translations: boolean;
	hidden?: boolean;
	disabled?: boolean;
	default?: Record<string, unknown>;

	validation?: {
		required?: boolean;
		zod?: ZodType<unknown>;
	};
}
export interface ColourFieldConfig extends SharedFieldConfig {
	type: "colour";

	labels: {
		title?: TranslationValue;
		description?: TranslationValue;
	};
	presets: string[];

	translations: boolean;
	hidden?: boolean;
	disabled?: boolean;
	default?: string;

	validation?: {
		required?: boolean;
	};
}
export interface DatetimeFieldConfig extends SharedFieldConfig {
	type: "datetime";

	labels: {
		title?: TranslationValue;
		description?: TranslationValue;
		placeholder?: TranslationValue;
	};

	translations: boolean;
	hidden?: boolean;
	disabled?: boolean;
	default?: string;

	validation?: {
		required?: boolean;
		zod?: ZodType<unknown>;
	};
}
export interface LinkFieldConfig extends SharedFieldConfig {
	type: "link";

	labels: {
		title?: TranslationValue;
		description?: TranslationValue;
		placeholder?: TranslationValue;
	};

	translations: boolean;
	hidden?: boolean;
	disabled?: boolean;
	default?: string;

	validation?: {
		required?: boolean;
	};
}
export interface UserFieldConfig extends SharedFieldConfig {
	type: "user";

	labels: {
		title?: TranslationValue;
		description?: TranslationValue;
	};

	translations: boolean;
	hidden?: boolean;
	disabled?: boolean;

	validation?: {
		required?: boolean;
	};
}

// -----------------------------------------------
// Custom Field Props

export type TabFieldProps = Partial<Omit<TabFieldConfig, "type" | "fields">>;
export type TextFieldProps = Partial<Omit<TextFieldConfig, "type">>;
export type WysiwygFieldProps = Partial<Omit<WysiwygFieldConfig, "type">>;
export type MediaFieldProps = Partial<Omit<MediaFieldConfig, "type">>;
export type RepeaterFieldProps = Partial<
	Omit<RepeaterFieldConfig, "type" | "fields">
>;
export type NumberFieldProps = Partial<Omit<NumberFieldConfig, "type">>;
export type CheckboxFieldProps = Partial<Omit<CheckboxFieldConfig, "type">>;
export type SelectFieldProps = Partial<Omit<SelectFieldConfig, "type">>;
export type TextareaFieldProps = Partial<Omit<TextareaFieldConfig, "type">>;
export type JsonFieldProps = Partial<Omit<JsonFieldConfig, "type">>;
export type ColourFieldProps = Partial<Omit<ColourFieldConfig, "type">>;
export type DatetimeFieldProps = Partial<Omit<DatetimeFieldConfig, "type">>;
export type LinkFieldProps = Partial<Omit<LinkFieldConfig, "type">>;
export type UserFieldProps = Partial<Omit<UserFieldConfig, "type">>;

// -----------------------------------------------
// Data

export type CustomFieldInsertItem<T extends FieldTypes> = {
	localeCode: string;
	collectionBrickId: number;
	key: string;
	type: T;
	groupId: number | null;
	textValue: string | null;
	intValue: number | null;
	boolValue: BooleanInt | null;
	jsonValue: string | null;
	mediaId: number | null;
	userId: number | null;
};

// -----------------------------------------------
// Response Values

export type TabResValue = null;
export type TextResValue = string | null;
export type WysiwygResValue = string | null;
export type MediaResValue = number | null;
export type RepeaterResValue = null;
export type NumberResValue = number | null;
export type CheckboxResValue = BooleanInt | null;
export type SelectReValue = string | null;
export type TextareaResValue = string | null;
export type JsonResValue = Record<string, unknown> | null;
export type ColourResValue = string | null;
export type DatetimeResValue = string | null;
// TODO: this should be moved to the meta field
export type LinkResValue = {
	url: string | null;
	target: string | null;
	label: string | null;
} | null;
export type UserResValue = number | null;

// -----------------------------------------------
// Response Meta

export type TabResMeta = null;
export type TextResMeta = null;
export type WysiwygResMeta = null;
export type MediaResMeta = {
	id: number | null;
	url: string | null;
	key: string | null;
	mimeType: string | null;
	fileExtension: string | null;
	fileSize: number | null;
	width: number | null;
	height: number | null;
	titleTranslations?: Array<{
		value: string | null;
		localeCode: string | null;
	}>;
	altTranslations?: Array<{
		value: string | null;
		localeCode: string | null;
	}>;
	type: MediaType | null;
} | null;
export type RepeaterResMeta = null;
export type NumberResMeta = null;
export type CheckboxResMeta = null;
export type SelectResMeta = null;
export type TextareaResMeta = null;
export type JsonResMeta = null;
export type ColourResMeta = null;
export type DatetimeResMeta = null;
export type LinkResMeta = null;
export type UserResMeta = {
	username: string | null;
	email: string | null;
	firstName: string | null;
	lastName: string | null;
} | null;
