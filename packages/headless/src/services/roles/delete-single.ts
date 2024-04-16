import { HeadlessAPIError } from "../../utils/error-handler.js";
import Repository from "../../libs/repositories/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	id: number;
}

const deleteSingle = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	const RolesRepo = Repository.get("roles", serviceConfig.db);

	const deleteRoles = await RolesRepo.deleteMultiple({
		where: [
			{
				key: "id",
				operator: "=",
				value: data.id,
			},
		],
	});

	if (deleteRoles.length === 0) {
		throw new HeadlessAPIError({
			type: "basic",
			status: 500,
		});
	}
};

export default deleteSingle;
