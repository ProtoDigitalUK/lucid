import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import formatRole from "../../format/format-roles.js";

export interface ServiceData {
	id: number;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const role = await serviceConfig.config.db.client
		.selectFrom("headless_roles")
		.select((eb) => [
			"id",
			"name",
			"created_at",
			"updated_at",
			"description",
			serviceConfig.config.db
				.jsonArrayFrom(
					eb
						.selectFrom("headless_role_permissions")
						.select([
							"headless_role_permissions.id",
							"headless_role_permissions.permission",
							"headless_role_permissions.role_id",
						])
						.whereRef(
							"headless_role_permissions.role_id",
							"=",
							"headless_roles.id",
						),
				)
				.as("permissions"),
		])
		.where("id", "=", data.id)
		.executeTakeFirst();

	if (role === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("role"),
			}),
			message: T("error_not_found_message", {
				name: T("role"),
			}),
			status: 404,
		});
	}

	return formatRole({
		role: role,
	});
};

export default getSingle;
