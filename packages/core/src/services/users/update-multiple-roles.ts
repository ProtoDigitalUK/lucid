import LucidServices from "../index.js";
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
> = async (service, data) => {
	if (data.roleIds === undefined) {
		return {
			error: undefined,
			data: undefined,
		};
	}

	const UserRolesRepo = Repository.get("user-roles", service.db);

	const [roleExistsRes] = await Promise.all([
		LucidServices.user.checks.checkRolesExist(service, {
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
