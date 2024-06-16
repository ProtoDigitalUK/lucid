import T from "../../../translations/index.js";
import constants from "../../../constants.js";
import { LucidError } from "../../../utils/error-handler.js";
import serviceWrapper from "../../services/service-wrapper.js";
import LucidServices from "../../../services/index.js";
import Repository from "../../repositories/index.js";
import Formatter from "../../formatters/index.js";
import type { ServiceConfig } from "../../services/types.js";

const seedDefaultRoles = async (service: ServiceConfig) => {
	try {
		const RolesRepo = Repository.get("roles", service.db);

		const totalRoleCount = await RolesRepo.count();
		if (Formatter.parseCount(totalRoleCount?.count) > 0) return;

		const rolePromises = [];
		for (const role of constants.seedDefaults.roles) {
			rolePromises.push(
				serviceWrapper(LucidServices.role.createSingle, {
					transaction: false,
				})(service, {
					name: role.name,
					description: role.description,
					permissions: role.permissions,
				}),
			);
		}
		await Promise.all(rolePromises);
	} catch (error) {
		throw new LucidError({
			message: T("roles_error_occured_saving_default"),
		});
	}
};

export default seedDefaultRoles;
