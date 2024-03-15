import type { BrickResT } from "./bricks.js";
import type { FieldTypes } from "../../headless/src/builders/brick-builder/types.js";

export interface PagesResT {
	id: number;
	parent_id: number | null;
	collection_key: string | null;

	title_translations: {
		language_id: number | null;
		value: string | null;
	}[];
	excerpt_translations: {
		language_id: number | null;
		value: string | null;
	}[];
	slug: string | null;
	full_slug: string | null;
	collection_slug: string | null;

	homepage: boolean;

	created_by: number | null;
	created_at: string | null;
	updated_at: string | null;

	published: boolean;
	published_at: string | null;

	author: {
		id: number | null;
		email: string | null;
		first_name: string | null;
		last_name: string | null;
		username: string | null;
	} | null;

	categories?: Array<number> | null;
	bricks?: Array<BrickResT> | null;
}

export interface SingleBuilderResT {
	id: number;
	bricks: Array<BrickResT>;
}

// biome-ignore lint/suspicious/noRedeclare: <explanation> // TODO: return to this, why does it exist?
export type FieldTypes = FieldTypes;
