import type { Config } from "../libs/config/config-schema.js";
import type { HeadlessRoles, Select } from "../libs/db/types.js";
import {
	deleteQB,
	selectQB,
	type QueryBuilderWhereT,
} from "../libs/db/query-builder.js";

export default class Roles {
	constructor(private config: Config) {}
}
