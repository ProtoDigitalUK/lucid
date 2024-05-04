import { deleteQB, type QueryBuilderWhereT } from "../db/query-builder.js";
import type { KyselyDB } from "../db/types.js";

export default class UserRolesRepo {
	constructor(private db: KyselyDB) {}

	// ----------------------------------------
	// create
	createMultiple = async (props: {
		items: Array<{
			userId: number;
			roleId: number;
		}>;
	}) => {
		return this.db
			.insertInto("lucid_user_roles")
			.values(
				props.items.map((i) => ({
					user_id: i.userId,
					role_id: i.roleId,
				})),
			)
			.execute();
	};
	// ----------------------------------------
	// delete
	deleteMultiple = async (props: {
		where: QueryBuilderWhereT<"lucid_user_roles">;
	}) => {
		let query = this.db.deleteFrom("lucid_user_roles").returning("id");

		query = deleteQB(query, props.where);

		return query.execute();
	};
}
