import type { HeadlessCollectionCategories, Select } from "../libs/db/types.js";
import {
	deleteQB,
	selectQB,
	type QueryBuilderWhereT,
} from "../libs/db/query-builder.js";

export default class CollectionCategories {
	constructor(private db: DB) {}
}
