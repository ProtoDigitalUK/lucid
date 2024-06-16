import T from "../../translations/index.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { ServiceFn } from "../../libs/services/types.js";
import type { RoleResponse } from "../../types/response.js";

const getSingle: ServiceFn<
	[
		{
			id: number;
		},
	],
	RoleResponse
> = async (service, data) => {
	const RolesRepo = Repository.get("roles", service.db);
	const RolesFormatter = Formatter.get("roles");

	const role = await RolesRepo.selectSingleById({
		id: data.id,
		config: service.config,
	});

	if (role === undefined) {
		return {
			error: {
				type: "basic",
				message: T("role_not_found_message"),
				status: 404,
			},
			data: undefined,
		};
	}

	return {
		error: undefined,
		data: RolesFormatter.formatSingle({
			role: role,
		}),
	};
};

export default getSingle;
