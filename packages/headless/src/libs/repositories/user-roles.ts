import { deleteQB, type QueryBuilderWhereT } from "../db/query-builder.js";

export default class UserRolesRepo {
	constructor(private db: DB) {}

	// ----------------------------------------
	// create
	createMultiple = async (props: {
		items: Array<{
			userId: number;
			roleId: number;
		}>;
	}) => {
		return this.db
			.insertInto("headless_user_roles")
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
		where: QueryBuilderWhereT<"headless_user_roles">;
	}) => {
		let query = this.db.deleteFrom("headless_user_roles").returning("id");

		query = deleteQB(query, props.where);

		return query.execute();
	};
}
