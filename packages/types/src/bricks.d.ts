import type {
	CustomFieldT,
	FieldTypesT,
} from "../../headless/src/libs/builders/field-builder/index.js";
import type { BrickConfigPropsT } from "../../headless/src/libs/builders/brick-builder/index.js";
import type { MediaTypeT } from "./media.js";

export interface BrickConfigT {
	key: string;
	title: string;
	fields?: CustomField[];
	preview?: BrickConfigPropsT["preview"];
}

// biome-ignore lint/suspicious/noRedeclare: <explanation>
export type CustomFieldT = CustomFieldT;

export type FieldResValueT =
	| string
	| number
	| boolean
	| null
	| undefined
	| Record<string, unknown>
	| LinkValueT
	| MediaValueT
	| PageLinkValueT;

export type FieldResMetaT = null | undefined | MediaMetaT | PageLinkMetaT;

export interface PageLinkValueT {
	id: number | null;
	target?: string | null;
	label?: string | null;
}

export interface PageLinkMetaT {
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
