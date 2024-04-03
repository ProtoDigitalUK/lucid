import type { HeadlessCollectionDocuments, Select } from "../libs/db/types.js";
import {
	deleteQB,
	selectQB,
	type QueryBuilderWhereT,
} from "../libs/db/query-builder.js";

export default class CollectionDocumentsRepo {
	constructor(private db: DB) {}
}
