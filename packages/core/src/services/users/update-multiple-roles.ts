import usersServices from "./index.js";
import Repository from "../../libs/repositories/index.js";
import type { ServiceFn } from "../../libs/services/types.js";

const updateMultipleRoles: ServiceFn<
	[
		{
			userId: number;
			roleIds?: number[];
		},
	],
	undefined
> = async (serviceConfig, data) => {
	if (data.roleIds === undefined) {
		return {
			error: undefined,
			data: undefined,
		};
	}

	const UserRolesRepo = Repository.get("user-roles", serviceConfig.db);

	const [roleExistsRes] = await Promise.all([
		usersServices.checks.checkRolesExist(serviceConfig, {
			roleIds: data.roleIds || [],
		}),
		UserRolesRepo.deleteMultiple({
			where: [
				{
					key: "user_id",
					operator: "=",
					value: data.userId,
				},
			],
		}),
	]);
	if (roleExistsRes.error) return roleExistsRes;

	if (data.roleIds.length === 0) {
		return {
			error: undefined,
			data: undefined,
		};
	}

	await UserRolesRepo.createMultiple({
		items: data.roleIds.map((r) => ({
			userId: data.userId,
			roleId: r,
		})),
	});

	return {
		error: undefined,
		data: undefined,
	};
};

export default updateMultipleRoles;
