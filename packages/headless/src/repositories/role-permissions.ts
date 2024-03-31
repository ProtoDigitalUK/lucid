import type { HeadlessRolePermissions, Select } from "../libs/db/types.js";
import {
	deleteQB,
	selectQB,
	type QueryBuilderWhereT,
} from "../libs/db/query-builder.js";

export default class RolePermissions {
	constructor(private db: DB) {}
}
