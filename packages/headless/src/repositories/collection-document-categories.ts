import type {
	HeadlessCollectionDocumentCategories,
	Select,
} from "../libs/db/types.js";
import {
	deleteQB,
	selectQB,
	type QueryBuilderWhereT,
} from "../libs/db/query-builder.js";

export default class CollectionDocumentCategories {
	constructor(private db: DB) {}
}
