import usersServices from "./index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import Repository from "../../libs/repositories/index.js";

export interface ServiceData {
	userId: number;
	roleIds?: number[];
}

const updateMultipleRoles = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.roleIds === undefined) return;

	const UserRolesRepo = Repository.get("user-roles", serviceConfig.db);

	await Promise.all([
		serviceWrapper(usersServices.checks.checkRolesExist, false)(
			serviceConfig,
			{
				roleIds: data.roleIds || [],
			},
		),
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

	if (data.roleIds.length === 0) return;

	await UserRolesRepo.createMultiple({
		items: data.roleIds.map((r) => ({
			userId: data.userId,
			roleId: r,
		})),
	});
};

export default updateMultipleRoles;
