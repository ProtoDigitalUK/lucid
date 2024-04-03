import { deleteQB, type QueryBuilderWhereT } from "../libs/db/query-builder.js";
import type { PermissionT } from "@headless/types/src/permissions.js";

export default class RolePermissionsRepo {
	constructor(private db: DB) {}

	// ----------------------------------------
	// create
	createMultiple = async (props: {
		items: Array<{
			roleId: number;
			permission: PermissionT;
		}>;
	}) => {
		return this.db
			.insertInto("headless_role_permissions")
			.values(
				props.items.map((i) => ({
					role_id: i.roleId,
					permission: i.permission,
				})),
			)
			.execute();
	};
	// ----------------------------------------
	// delete
	deleteMultiple = async (props: {
		where: QueryBuilderWhereT<"headless_role_permissions">;
	}) => {
		let query = this.db
			.deleteFrom("headless_role_permissions")
			.returning("id");

		query = deleteQB(query, props.where);

		return query.execute();
	};
}
