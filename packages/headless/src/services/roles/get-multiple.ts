import type z from "zod";
import formatRole from "../../format/format-roles.js";
import type rolesSchema from "../../schemas/roles.js";
import { parseCount } from "../../utils/helpers.js";
import Repository from "../../libs/repositories/index.js";

export interface ServiceData {
	query: z.infer<typeof rolesSchema.getMultiple.query>;
}

const getMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const RolesRepo = Repository.get("roles", serviceConfig.db);

	const [roles, rolesCount] = await RolesRepo.selectMultipleFiltered({
		query: data.query,
		config: serviceConfig.config,
	});

	return {
		data: roles.map((r) => {
			return formatRole({
				role: r,
			});
		}),
		count: parseCount(rolesCount?.count),
	};
};

export default getMultiple;
