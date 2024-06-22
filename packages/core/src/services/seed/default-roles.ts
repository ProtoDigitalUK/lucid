import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import constants from "../../constants/constants.js";
import serviceWrapper from "../../utils/services/service-wrapper.js";
import type { ServiceContext, ServiceFn } from "../../utils/services/types.js";

const defaultRoles: ServiceFn<[], undefined> = async (
	context: ServiceContext,
) => {
	const RolesRepo = Repository.get("roles", context.db);

	const totalRoleCount = await RolesRepo.count();
	if (Formatter.parseCount(totalRoleCount?.count) > 0) {
		return {
			error: undefined,
			data: undefined,
		};
	}

	const rolePromises = [];
	for (const role of constants.seedDefaults.roles) {
		rolePromises.push(
			serviceWrapper(context.services.role.createSingle, {
				transaction: false,
			})(context, {
				name: role.name,
				description: role.description,
				permissions: role.permissions,
			}),
		);
	}
	await Promise.all(rolePromises);

	return {
		error: undefined,
		data: undefined,
	};
};

export default defaultRoles;
