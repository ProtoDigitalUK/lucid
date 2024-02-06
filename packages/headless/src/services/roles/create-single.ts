import T from "../../translations/index.js";
import { APIError, modelErrors } from "../../utils/app/error-handler.js";
import { roles, rolePermissions } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import rolesServices from "./index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import formatRole from "../../format/format-roles.js";

export interface ServiceData {
	name: string;
	description?: string;
	permissionGroups: {
		permissions: string[];
		environment_key?: string | undefined;
	}[];
}

const createSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const [validatePerms, checkNameIsUnique] = await Promise.all([
		serviceWrapper(rolesServices.validatePermissions, false)(
			serviceConfig,
			{
				permissionGroups: data.permissionGroups,
			},
		),
		serviceConfig.db
			.select()
			.from(roles)
			.where(eq(roles.name, data.name))
			.execute(),
	]);

	if (checkNameIsUnique.length > 0) {
		throw new APIError({
			type: "basic",
			name: T("dynamic_error_name", {
				name: "Role Error",
			}),
			message: T("not_unique_error_message"),
			status: 400,
			errors: modelErrors({
				name: {
					code: "invalid",
					message: T("not_unique_error_message"),
				},
			}),
		});
	}

	const newRole = await serviceConfig.db
		.insert(roles)
		.values({
			name: data.name,
			description: data.description,
		})
		.returning({
			id: roles.id,
		})
		.execute();

	if (newRole.length === 0) {
		throw new APIError({
			type: "basic",
			name: T("dynamic_error_name", {
				name: "Role Error",
			}),
			message: T("creation_error_message", {
				name: "role",
			}),
			status: 500,
		});
	}

	const newRoleId = newRole[0].id;

	if (validatePerms.length > 0) {
		await serviceConfig.db
			.insert(rolePermissions)
			.values(
				validatePerms.map((permission) => ({
					role_id: newRoleId,
					permission: permission.permission,
					environment_key: permission.environmentKey,
				})),
			)
			.execute();
	}

	const role = await serviceConfig.db.query.roles.findFirst({
		with: {
			permissions: true,
		},
		where: eq(roles.id, newRoleId),
	});

	if (!role) {
		throw new APIError({
			type: "basic",
			name: T("dynamic_error_name", {
				name: "Role Error",
			}),
			message: T("creation_error_message", {
				name: "role",
			}),
			status: 500,
		});
	}

	return formatRole(role);
};

export default createSingle;
