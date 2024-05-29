import type { ZodType } from "zod";
import type { MediaType } from "../../types/response.js";

type CustomFieldMap = {
	tab: {
		config: undefined;
		data: TabFieldData;
	};
	text: {
		config: undefined;
		data: TextFieldData;
	};
	wysiwyg: {
		config: undefined;
		data: WysiwygFieldData;
	};
	media: {
		config: undefined;
		data: MediaFieldData;
	};
	repeater: {
		config: undefined;
		data: RepeaterFieldData;
	};
	number: {
		config: undefined;
		data: NumberFieldData;
	};
	checkbox: {
		config: undefined;
		data: CheckboxFieldData;
	};
	select: {
		config: undefined;
		data: SelectFieldData;
	};
	textarea: {
		config: undefined;
		data: TextareaFieldData;
	};
	json: {
		config: undefined;
		data: JsonFieldData;
	};
	colour: {
		config: undefined;
		data: ColourFieldData;
	};
	datetime: {
		config: undefined;
		data: DatetimeFieldData;
	};
	link: {
		config: undefined;
		data: LinkFieldData;
	};
	user: {
		config: undefined;
		data: UserFieldData;
	};
};
export type FieldTypes = keyof CustomFieldMap;
export type CustomFieldData<T extends FieldTypes> = CustomFieldMap[T]["data"];

// -----------------------------------------------
// Custom Field Data
export interface TabFieldData {
	key: string;
}
export interface TextFieldData {
	key: string;
}
export interface WysiwygFieldData {
	key: string;
}
export interface MediaFieldData {
	key: string;
}
export interface RepeaterFieldData {
	key: string;
}
export interface NumberFieldData {
	key: string;
}
export interface CheckboxFieldData {
	key: string;
}
export interface SelectFieldData {
	key: string;
}
export interface TextareaFieldData {
	key: string;
}
export interface JsonFieldData {
	key: string;
}
export interface ColourFieldData {
	key: string;
}
export interface DatetimeFieldData {
	key: string;
}
export interface LinkFieldData {
	key: string;
}
export interface UserFieldData {
	key: string;
}
