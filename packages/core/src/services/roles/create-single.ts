import T from "../../translations/index.js";
import rolesServices from "./index.js";
import Repository from "../../libs/repositories/index.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import type { ServiceFn } from "../../libs/services/types.js";

const createSingle: ServiceFn<
	[
		{
			name: string;
			description?: string;
			permissions: string[];
		},
	],
	number
> = async (serviceConfig, data) => {
	const RolesRepo = Repository.get("roles", serviceConfig.db);

	const [validatePermsRes, checkNameIsUnique] = await Promise.all([
		serviceWrapper(rolesServices.validatePermissions, {
			transaction: false,
		})(serviceConfig, {
			permissions: data.permissions,
		}),
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
	if (validatePermsRes.error) throw validatePermsRes.error;

	if (checkNameIsUnique !== undefined) {
		return {
			error: {
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
			},
			data: undefined,
		};
	}

	const newRoles = await RolesRepo.createSingle({
		name: data.name,
		description: data.description,
	});

	if (newRoles === undefined) {
		return {
			error: {
				type: "basic",
				status: 500,
			},
			data: undefined,
		};
	}

	if (validatePermsRes.data.length > 0) {
		const RolePermissionsRepo = Repository.get(
			"role-permissions",
			serviceConfig.db,
		);

		await RolePermissionsRepo.createMultiple({
			items: validatePermsRes.data.map((p) => ({
				roleId: newRoles.id,
				permission: p.permission,
			})),
		});
	}

	return {
		error: undefined,
		data: newRoles.id,
	};
};

export default createSingle;
