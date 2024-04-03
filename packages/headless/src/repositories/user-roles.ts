import { deleteQB, type QueryBuilderWhereT } from "../libs/db/query-builder.js";

export default class UserRolesRepo {
	constructor(private db: DB) {}

	// ----------------------------------------
	// create
	createMultiple = async (props: {
		userRoles: Array<{
			userId: number;
			roleId: number;
		}>;
	}) => {
		return this.db
			.insertInto("headless_user_roles")
			.values(
				props.userRoles.map((ur) => ({
					user_id: ur.userId,
					role_id: ur.roleId,
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
