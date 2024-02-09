import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import formatUser from "../../format/format-user.js";
// import usersServices from "../users/index.js";

export interface ServiceData {
	user_id: number;
}

const getAuthenticatedUser = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const user = await serviceConfig.db
		.selectFrom("headless_users")
		.select([
			"id",
			"super_admin",
			"email",
			"username",
			"first_name",
			"last_name",
			"created_at",
			"updated_at",
		])
		.where("id", "=", data.user_id)
		.executeTakeFirst();

	if (!user) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("user"),
			}),
			message: T("error_not_found_message", {
				name: T("user"),
			}),
			status: 500,
		});
	}

	// TODO: update when we have permissions and roles implemented
	// Get user permissions
	// const permissions = await usersServices.getPermissions(fastify, {
	// 	user_id: data.user_id,
	// });

	return formatUser(user, undefined);
};

export default getAuthenticatedUser;
