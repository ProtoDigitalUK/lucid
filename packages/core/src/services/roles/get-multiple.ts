import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type z from "zod";
import type rolesSchema from "../../schemas/roles.js";
import type { ServiceFn } from "../../libs/services/types.js";
import type { RoleResponse } from "../../types/response.js";

const getMultiple: ServiceFn<
	[
		{
			query: z.infer<typeof rolesSchema.getMultiple.query>;
		},
	],
	{
		data: RoleResponse[];
		count: number;
	}
> = async (serviceConfig, data) => {
	const RolesRepo = Repository.get("roles", serviceConfig.db);
	const RolesFormatter = Formatter.get("roles");

	const [roles, rolesCount] = await RolesRepo.selectMultipleFiltered({
		query: data.query,
		config: serviceConfig.config,
	});

	return {
		error: undefined,
		data: {
			data: RolesFormatter.formatMultiple({
				roles: roles,
			}),
			count: Formatter.parseCount(rolesCount?.count),
		},
	};
};

export default getMultiple;
