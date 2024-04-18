import T from "../../../translations/index.js";
import { HeadlessAPIError } from "../../../utils/error-handler.js";
import Repository from "../../../libs/repositories/index.js";
import type { ServiceConfig } from "../../../utils/service-wrapper.js";

export interface ServiceData {
	roleIds: number[];
}

const checkRolesExist = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	if (data.roleIds.length === 0) return;

	const RolesRepo = Repository.get("roles", serviceConfig.db);
	const roles = await RolesRepo.selectMultiple({
		select: ["id"],
		where: [
			{
				key: "id",
				operator: "in",
				value: data.roleIds,
			},
		],
	});

	if (roles.length !== data.roleIds.length) {
		throw new HeadlessAPIError({
			type: "basic",
			status: 400,
			errorResponse: {
				body: {
					role_ids: {
						code: "invalid",
						message: T("error_not_found_message", {
							name: T("role"),
						}),
					},
				},
			},
		});
	}

	return;
};

export default checkRolesExist;
