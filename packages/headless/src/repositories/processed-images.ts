import type { Config } from "../libs/config/config-schema.js";
import type { HeadlessProcessedImages, Select } from "../libs/db/types.js";
import {
	deleteQB,
	selectQB,
	type QueryBuilderWhereT,
} from "../libs/db/query-builder.js";

export default class ProcessedImages {
	constructor(private config: Config) {}
}
