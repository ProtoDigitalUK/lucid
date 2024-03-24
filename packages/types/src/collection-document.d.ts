import type {
	BrickResFieldsT,
	BrickResT,
	CollectionContentResT,
} from "./bricks.js";
import type { FieldTypesT } from "../../headless/src/libs/field-builder/types.js";

export interface CollectionDocumentResT {
	id: number;
	parent_id: number | null;
	collection_key: string | null;

	slug: string | null;
	full_slug: string | null;
	collection_slug: string | null;

	homepage: boolean;

	created_by: number | null;
	created_at: string | null;
	updated_at: string | null;

	author: {
		id: number | null;
		email: string | null;
		first_name: string | null;
		last_name: string | null;
		username: string | null;
	} | null;

	categories?: Array<number> | null;
	bricks?: Array<BrickResT> | null;
	fields?: Array<BrickResFieldsT> | null;
}

export type FieldTypes = FieldTypesT;
