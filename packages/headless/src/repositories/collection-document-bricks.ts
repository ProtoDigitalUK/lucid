import type {
	HeadlessCollectionDocumentBricks,
	Select,
} from "../libs/db/types.js";
import {
	deleteQB,
	selectQB,
	type QueryBuilderWhereT,
} from "../libs/db/query-builder.js";

export default class CollectionDocumentBricksRepo {
	constructor(private db: DB) {}
}
