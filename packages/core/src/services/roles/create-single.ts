import T from "../../translations/index.js";
import lucidServices from "../index.js";
import Repository from "../../libs/repositories/index.js";
import type { ServiceFn } from "../../utils/services/types.js";

const createSingle: ServiceFn<
	[
		{
			name: string;
			description?: string;
			permissions: string[];
		},
	],
	number
> = async (service, data) => {
	const RolesRepo = Repository.get("roles", service.db);

	const [validatePermsRes, checkNameIsUnique] = await Promise.all([
		lucidServices.role.validatePermissions(service, {
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
	if (validatePermsRes.error) return validatePermsRes;

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
			service.db,
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
