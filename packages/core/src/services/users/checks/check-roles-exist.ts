import T from "../../../translations/index.js";
import Repository from "../../../libs/repositories/index.js";
import type { ServiceFn } from "../../../libs/services/types.js";

const checkRolesExist: ServiceFn<
	[
		{
			roleIds: number[];
		},
	],
	undefined
> = async (serviceConfig, data) => {
	if (data.roleIds.length === 0) {
		return {
			error: undefined,
			data: undefined,
		};
	}

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
		return {
			error: {
				type: "basic",
				status: 400,
				errorResponse: {
					body: {
						roleIds: {
							code: "invalid",
							message: T("error_not_found_message", {
								name: T("role"),
							}),
						},
					},
				},
			},
			data: undefined,
		};
	}

	return {
		error: undefined,
		data: undefined,
	};
};

export default checkRolesExist;
