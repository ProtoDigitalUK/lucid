import type {
	HeadlessCollectionDocumentFields,
	Select,
} from "../libs/db/types.js";
import {
	deleteQB,
	selectQB,
	type QueryBuilderWhereT,
} from "../libs/db/query-builder.js";

export default class CollectionDocumentFields {
	constructor(private db: DB) {}
}
