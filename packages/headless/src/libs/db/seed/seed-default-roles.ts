import T from "../../../translations/index.js";
import { sql } from "kysely";
import constants from "../../../constants.js";
import { InternalError } from "../../../utils/error-handler.js";
import { parseCount } from "../../../utils/helpers.js";
import serviceWrapper from "../../../utils/service-wrapper.js";
import rolesServices from "../../../services/roles/index.js";

const seedDefaultRoles = async (serviceConfig: ServiceConfigT) => {
	try {
		const totalRoleCount = (await serviceConfig.db
			.selectFrom("headless_roles")
			.select(sql`count(*)`.as("count"))
			.executeTakeFirst()) as { count: string } | undefined;

		if (parseCount(totalRoleCount?.count) > 0) return;

		const rolePromises = [];
		for (const role of constants.seedDefaults.roles) {
			rolePromises.push(
				serviceWrapper(rolesServices.createSingle, false)(
					{
						db: serviceConfig.db,
					},
					{
						name: role.name,
						description: role.description,
						permissions: role.permissions,
					},
				),
			);
		}
		await Promise.all(rolePromises);
	} catch (error) {
		throw new InternalError(
			T("dynamic_an_error_occurred_saving_default", {
				name: T("roles").toLowerCase(),
			}),
		);
	}
};

export default seedDefaultRoles;
