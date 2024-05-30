import type { ZodType } from "zod";
import type { MediaType } from "../../types/response.js";

// -----------------------------------------------
// Shared
export type TranslationValue = Record<string, string> | string;

// -----------------------------------------------
// Custom Field
export type CustomFieldMap = {
	tab: {
		config: TabFieldConfig;
		data: TabFieldData;
	};
	text: {
		config: TextFieldConfig;
		data: TextFieldData;
	};
	wysiwyg: {
		config: WysiwygFieldConfig;
		data: WysiwygFieldData;
	};
	media: {
		config: MediaFieldConfig;
		data: MediaFieldData;
	};
	repeater: {
		config: RepeaterFieldConfig;
		data: RepeaterFieldData;
	};
	number: {
		config: NumberFieldConfig;
		data: NumberFieldData;
	};
	checkbox: {
		config: CheckboxFieldConfig;
		data: CheckboxFieldData;
	};
	select: {
		config: SelectFieldConfig;
		data: SelectFieldData;
	};
	textarea: {
		config: TextareaFieldConfig;
		data: TextareaFieldData;
	};
	json: {
		config: JsonFieldConfig;
		data: JsonFieldData;
	};
	colour: {
		config: ColourFieldConfig;
		data: ColourFieldData;
	};
	datetime: {
		config: DatetimeFieldConfig;
		data: DatetimeFieldData;
	};
	link: {
		config: LinkFieldConfig;
		data: LinkFieldData;
	};
	user: {
		config: UserFieldConfig;
		data: UserFieldData;
	};
};
export type FieldTypes = keyof CustomFieldMap;

// -----------------------------------------------
// Custom Field Data

export type SharedFieldData = {
	key: string;
	type: FieldTypes;

	labels: {
		title: TranslationValue;
		description?: TranslationValue;
	};
};
export type CustomFieldData<T extends FieldTypes> = CustomFieldMap[T]["data"];

export interface TabFieldData extends SharedFieldData {
	type: "tab";

	labels: {
		title: TranslationValue;
		description?: TranslationValue;
	};
}
export interface TextFieldData extends SharedFieldData {
	type: "text";

	labels: {
		title: TranslationValue;
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
export interface WysiwygFieldData extends SharedFieldData {
	type: "wysiwyg";

	labels: {
		title: TranslationValue;
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
export interface MediaFieldData extends SharedFieldData {
	type: "media";

	labels: {
		title: TranslationValue;
		description: TranslationValue | undefined;
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
export interface RepeaterFieldData extends SharedFieldData {
	type: "repeater";

	validation?: {
		maxGroups?: number;
	};
}
export interface NumberFieldData extends SharedFieldData {
	type: "number";

	labels: {
		title: TranslationValue;
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
export interface CheckboxFieldData extends SharedFieldData {
	type: "checkbox";

	labels: {
		title: TranslationValue;
		description?: TranslationValue;
		true?: TranslationValue;
		false?: TranslationValue;
	};

	translations: boolean;
	hidden?: boolean;
	disabled?: boolean;
	default?: boolean;

	validation?: {
		required?: boolean;
	};
}
export interface SelectFieldData extends SharedFieldData {
	type: "select";

	labels: {
		title: TranslationValue;
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
export interface TextareaFieldData extends SharedFieldData {
	type: "textarea";

	labels: {
		title: TranslationValue;
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
export interface JsonFieldData extends SharedFieldData {
	type: "json";

	labels: {
		title: TranslationValue;
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
export interface ColourFieldData extends SharedFieldData {
	type: "colour";

	labels: {
		title: TranslationValue;
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
export interface DatetimeFieldData extends SharedFieldData {
	type: "datetime";

	labels: {
		title: TranslationValue;
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
export interface LinkFieldData extends SharedFieldData {
	type: "link";

	labels: {
		title: TranslationValue;
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
export interface UserFieldData extends SharedFieldData {
	type: "user";

	labels: {
		title: TranslationValue;
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
// Custom Field Config

export type CustomFieldConfig<T extends FieldTypes> =
	CustomFieldMap[T]["config"];

export type TabFieldConfig = Partial<Omit<TabFieldData, "type">>;
export type TextFieldConfig = Partial<Omit<TextFieldData, "type">>;
export type WysiwygFieldConfig = Partial<Omit<WysiwygFieldData, "type">>;
export type MediaFieldConfig = Partial<Omit<MediaFieldData, "type">>;
export type RepeaterFieldConfig = Partial<Omit<RepeaterFieldData, "type">>;
export type NumberFieldConfig = Partial<Omit<NumberFieldData, "type">>;
export type CheckboxFieldConfig = Partial<Omit<CheckboxFieldData, "type">>;
export type SelectFieldConfig = Partial<Omit<SelectFieldData, "type">>;
export type TextareaFieldConfig = Partial<Omit<TextareaFieldData, "type">>;
export type JsonFieldConfig = Partial<Omit<JsonFieldData, "type">>;
export type ColourFieldConfig = Partial<Omit<ColourFieldData, "type">>;
export type DatetimeFieldConfig = Partial<Omit<DatetimeFieldData, "type">>;
export type LinkFieldConfig = Partial<Omit<LinkFieldData, "type">>;
export type UserFieldConfig = Partial<Omit<UserFieldData, "type">>;
