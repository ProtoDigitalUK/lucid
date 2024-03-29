import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import formatUser from "../../format/format-user.js";

export interface ServiceData {
	user_id: number;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const user = await serviceConfig.db
		.selectFrom("headless_users")
		.select((eb) => [
			"email",
			"first_name",
			"last_name",
			"id",
			"created_at",
			"updated_at",
			"username",
			"super_admin",
			serviceConfig.config.db
				.jsonArrayFrom(
					eb
						.selectFrom("headless_user_roles")
						.innerJoin(
							"headless_roles",
							"headless_roles.id",
							"headless_user_roles.role_id",
						)
						.select((eb) => [
							"headless_roles.id",
							"headless_roles.name",
							"headless_roles.description",
							serviceConfig.config.db
								.jsonArrayFrom(
									eb
										.selectFrom("headless_role_permissions")
										.select(["permission"])
										.whereRef(
											"role_id",
											"=",
											"headless_roles.id",
										),
								)
								.as("permissions"),
						])
						.whereRef("user_id", "=", "headless_users.id"),
				)
				.as("roles"),
		])
		.where("id", "=", data.user_id)
		.where("is_deleted", "=", 0)
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
			status: 404,
		});
	}

	return formatUser({
		user: user,
	});
};

export default getSingle;
