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
> = async (service, data) => {
	if (data.roleIds.length === 0) {
		return {
			error: undefined,
			data: undefined,
		};
	}

	const RolesRepo = Repository.get("roles", service.db);
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
							message: T("role_not_found_message"),
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
