import type {
	BrickResFieldsT,
	BrickResT,
	CollectionContentResT,
} from "./bricks.js";
import type { FieldTypesT } from "../../headless/src/libs/builders/field-builder/types.js";

export interface CollectionDocumentResT {
	id: number;
	collection_key: string | null;

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

	bricks?: Array<BrickResT> | null;
	fields?: Array<BrickResFieldsT> | null;
}

export type FieldTypes = FieldTypesT;
