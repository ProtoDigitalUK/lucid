import { type FastifyInstance } from "fastify";
import formatUserPermissions from "../../format/format-user-permissions.js";

export interface ServiceData {
	user_id: number;
}

const getPermissions = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const rolesRes = await serviceConfig.db
		.selectFrom("headless_user_roles")
		.selectAll()
		.where("user_id", "=", data.user_id)
		.execute();

	if (rolesRes.length === 0) {
		return null;
	}

	// for each role, get its permissions
	const rolePermissions = await serviceConfig.db
		.selectFrom("headless_role_permissions")
		.selectAll()
		.where(
			"role_id",
			"in",
			rolesRes.map((role) => role.role_id),
		)
		.execute();

	console.log("roles", rolesRes);
	console.log("permissions", rolePermissions);

	// return formatUserPermissions(roles, permissions);
};

export default getPermissions;
