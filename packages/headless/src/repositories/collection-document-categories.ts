import type { Config } from "../libs/config/config-schema.js";
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
	constructor(private config: Config) {}
}
