import T from "../../translations/index.js";
import { APIError, modelErrors } from "../../utils/error-handler.js";
import rolesServices from "./index.js";
import serviceWrapper from "../../utils/service-wrapper.js";

export interface ServiceData {
	name: string;
	description?: string;
	permissions: string[];
}

const createSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const [validatePerms, checkNameIsUnique] = await Promise.all([
		serviceWrapper(rolesServices.validatePermissions, false)(
			serviceConfig,
			{
				permissions: data.permissions,
			},
		),
		serviceConfig.db
			.selectFrom("headless_roles")
			.select("id")
			.where("name", "=", data.name)
			.executeTakeFirst(),
	]);

	if (checkNameIsUnique !== undefined) {
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

	const newRoles = await serviceConfig.db
		.insertInto("headless_roles")
		.values({
			name: data.name,
			description: data.description,
		})
		.returning("id")
		.executeTakeFirst();

	if (newRoles === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_created_name", {
				name: T("role"),
			}),
			message: T("creation_error_message", {
				name: T("role").toLowerCase(),
			}),
			status: 500,
		});
	}

	if (validatePerms.length > 0) {
		await serviceConfig.db
			.insertInto("headless_role_permissions")
			.values(
				validatePerms.map((permission) => ({
					role_id: newRoles.id,
					permission: permission.permission,
				})),
			)
			.execute();
	}

	return newRoles.id;
};

export default createSingle;
