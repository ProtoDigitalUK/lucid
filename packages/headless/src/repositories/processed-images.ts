import type { HeadlessProcessedImages, Select } from "../libs/db/types.js";
import {
	deleteQB,
	selectQB,
	type QueryBuilderWhereT,
} from "../libs/db/query-builder.js";

export default class ProcessedImagesRepo {
	constructor(private db: DB) {}
}
