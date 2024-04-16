import type z from "zod";
import type rolesSchema from "../../schemas/roles.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	query: z.infer<typeof rolesSchema.getMultiple.query>;
}

const getMultiple = async (serviceConfig: ServiceConfig, data: ServiceData) => {
	const RolesRepo = Repository.get("roles", serviceConfig.db);
	const RolesFormatter = Formatter.get("roles");

	const [roles, rolesCount] = await RolesRepo.selectMultipleFiltered({
		query: data.query,
		config: serviceConfig.config,
	});

	return {
		data: RolesFormatter.formatMultiple({
			roles: roles,
		}),
		count: Formatter.parseCount(rolesCount?.count),
	};
};

export default getMultiple;
