import type {
	CustomFieldT,
	FieldTypesT,
} from "../../headless/src/libs/field-builder/index.js";
import type { BrickConfigPropsT } from "../../headless/src/libs/brick-builder/index.js";
import type { MediaTypeT } from "./media.js";

export interface BrickConfigT {
	key: string;
	title: string;
	fields?: CustomField[];
	preview?: BrickConfigPropsT["preview"];
}

// biome-ignore lint/suspicious/noRedeclare: <explanation>
export type CustomFieldT = CustomFieldT;
// biome-ignore lint/suspicious/noRedeclare: <explanation>
export type FieldTypesT = FieldTypesT;

export type BrickFieldValueT =
	| string
	| number
	| boolean
	| null
	| undefined
	| Record<string, unknown>
	| LinkValueT
	| MediaValueT
	| PageLinkValueT;

export type BrickFieldMetaT = null | undefined | MediaMetaT | PageLinkMetaT;

export interface BrickResT {
	id: number;
	key: string;
	order: number;
	type: "builder" | "fixed";
	groups: Array<{
		group_id: number;
		group_order: number;
		parent_group_id: number | null;
		repeater_key: string;
		language_id: number;
	}>;
	fields: Array<BrickResFieldsT>;
}

export interface BrickResFieldsT {
	fields_id: number;
	key: string;
	type: FieldTypes;
	group_id?: number | null;
	value?: BrickFieldValueT;
	meta?: BrickFieldMetaT;
	language_id: number;
}

export interface PageLinkValueT {
	id: number | null;
	target?: string | null;
	label?: string | null;
}

export interface PageLinkMetaT {
	slug?: string;
	full_slug?: string;
	collection_slug?: string;
	title_translations?: Array<{
		value: string | null;
		language_id: number | null;
	}>;
}

export interface LinkValueT {
	url: string | null;
	target?: string | null;
	label?: string | null;
}

export type MediaValueT = number;
export interface MediaMetaT {
	id?: number;
	url?: string;
	key?: string;
	mime_type?: string;
	file_extension?: string;
	file_size?: number;
	width?: number;
	height?: number;
	title_translations?: Array<{
		value: string | null;
		language_id: number | null;
	}>;
	alt_translations?: Array<{
		value: string | null;
		language_id: number | null;
	}>;
	type?: MediaTypeT;
}
