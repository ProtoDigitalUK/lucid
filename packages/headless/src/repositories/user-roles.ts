import type { HeadlessUserRoles, Select } from "../libs/db/types.js";
import {
	deleteQB,
	selectQB,
	type QueryBuilderWhereT,
} from "../libs/db/query-builder.js";

export default class UserRolesRepo {
	constructor(private db: DB) {}
}
