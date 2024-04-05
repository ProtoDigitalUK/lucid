import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import formatRole from "../../format/format-roles.js";
import Repository from "../../libs/repositories/index.js";

export interface ServiceData {
	id: number;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const RolesRepo = Repository.get("roles", serviceConfig.db);
	const role = await RolesRepo.selectSingleById({
		id: data.id,
		config: serviceConfig.config,
	});

	if (role === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("role"),
			}),
			message: T("error_not_found_message", {
				name: T("role"),
			}),
			status: 404,
		});
	}

	return formatRole({
		role: role,
	});
};

export default getSingle;
