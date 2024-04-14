import usersServices from "./index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import Repository from "../../libs/repositories/index.js";

export interface ServiceData {
	user_id: number;
	role_ids?: number[];
}

const updateMultipleRoles = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.role_ids === undefined) return;

	const UserRolesRepo = Repository.get("user-roles", serviceConfig.db);

	await Promise.all([
		serviceWrapper(usersServices.checks.checkRolesExist, false)(
			serviceConfig,
			{
				role_ids: data.role_ids || [],
			},
		),
		UserRolesRepo.deleteMultiple({
			where: [
				{
					key: "user_id",
					operator: "=",
					value: data.user_id,
				},
			],
		}),
	]);

	if (data.role_ids.length === 0) return;

	await UserRolesRepo.createMultiple({
		items: data.role_ids.map((r) => ({
			userId: data.user_id,
			roleId: r,
		})),
	});
};

export default updateMultipleRoles;
