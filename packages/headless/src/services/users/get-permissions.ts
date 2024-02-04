import { type FastifyInstance } from "fastify";
import { eq, inArray } from "drizzle-orm";
import { userRoles, rolePermissions } from "../../db/schema.js";
import formatUserPermissions from "../../format/format-user-permissions.js";

export interface ServiceData {
	user_id: number;
}

const getPermissions = async (fastify: FastifyInstance, data: ServiceData) => {
	const rolesRes = await fastify.db
		.select()
		.from(userRoles)
		.where(eq(userRoles.user_id, data.user_id))
		.execute();

	if (rolesRes.length === 0) {
		return null;
	}

	// for each role, get its permissions
	const rolePermissionsRes = await fastify.db
		.select()
		.from(rolePermissions)
		.where(
			inArray(
				rolePermissions.role_id,
				rolesRes.map((role) => role.role_id),
			),
		)
		.execute();

	console.log("roles", rolesRes);
	console.log("permissions", rolePermissionsRes);

	// return formatUserPermissions(roles, permissions);
};

export default getPermissions;
