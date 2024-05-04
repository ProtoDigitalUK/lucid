import T from "../../translations/index.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import rolesServices from "./index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import Repository from "../../libs/repositories/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	name: string;
	description?: string;
	permissions: string[];
}

const createSingle = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	const RolesRepo = Repository.get("roles", serviceConfig.db);

	const [validatePerms, checkNameIsUnique] = await Promise.all([
		serviceWrapper(rolesServices.validatePermissions, false)(
			serviceConfig,
			{
				permissions: data.permissions,
			},
		),
		RolesRepo.selectSingle({
			select: ["id"],
			where: [
				{
					key: "name",
					operator: "=",
					value: data.name,
				},
			],
		}),
	]);

	if (checkNameIsUnique !== undefined) {
		throw new LucidAPIError({
			type: "basic",
			message: T("not_unique_error_message"),
			status: 400,
			errorResponse: {
				body: {
					name: {
						code: "invalid",
						message: T("not_unique_error_message"),
					},
				},
			},
		});
	}

	const newRoles = await RolesRepo.createSingle({
		name: data.name,
		description: data.description,
	});

	if (newRoles === undefined) {
		throw new LucidAPIError({
			type: "basic",
			status: 500,
		});
	}

	if (validatePerms.length > 0) {
		const RolePermissionsRepo = Repository.get(
			"role-permissions",
			serviceConfig.db,
		);

		await RolePermissionsRepo.createMultiple({
			items: validatePerms.map((p) => ({
				roleId: newRoles.id,
				permission: p.permission,
			})),
		});
	}

	return newRoles.id;
};

export default createSingle;
