import T from "../../../translations/index.js";
import { HeadlessAPIError } from "../../../utils/error-handler.js";
import Repository from "../../../libs/repositories/index.js";

export interface ServiceData {
	role_ids: number[];
}

const checkRolesExist = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.role_ids.length === 0) return;

	const RolesRepo = Repository.get("roles", serviceConfig.db);
	const roles = await RolesRepo.selectMultiple({
		select: ["id"],
		where: [
			{
				key: "id",
				operator: "in",
				value: data.role_ids,
			},
		],
	});

	if (roles.length !== data.role_ids.length) {
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
