import type { Config } from "../libs/config/config-schema.js";
import type { HeadlessRolePermissions, Select } from "../libs/db/types.js";
import {
	deleteQB,
	selectQB,
	type QueryBuilderWhereT,
} from "../libs/db/query-builder.js";

export default class RolePermissions {
	constructor(private config: Config) {}

	// dynamic query methods

	// fixed query methods
}
