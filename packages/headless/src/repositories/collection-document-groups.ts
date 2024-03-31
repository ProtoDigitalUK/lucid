import type {
	HeadlessCollectionDocumentGroups,
	Select,
} from "../libs/db/types.js";
import {
	deleteQB,
	selectQB,
	type QueryBuilderWhereT,
} from "../libs/db/query-builder.js";

export default class CollectionDocumentGroups {
	constructor(private db: DB) {}
}
