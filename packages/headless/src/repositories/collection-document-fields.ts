import type {
	HeadlessCollectionDocumentFields,
	Select,
} from "../libs/db/types.js";
import {
	deleteQB,
	selectQB,
	type QueryBuilderWhereT,
} from "../libs/db/query-builder.js";

export default class CollectionDocumentFieldsRepo {
	constructor(private db: DB) {}

	// ----------------------------------------
	// selects
	// ----------------------------------------
	// create
	// ----------------------------------------
	// update
	// ----------------------------------------
	// delete
}
