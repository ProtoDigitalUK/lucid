import T from "../../translations/index.js";
import Repository from "../../libs/repositories/index.js";
import UsersServices from "./index.js";
import type { ServiceFn } from "../../libs/services/types.js";

const deleteSingle: ServiceFn<
	[
		{
			userId: number;
			currentUserId: number;
		},
	],
	undefined
> = async (serviceConfig, data) => {
	const UsersRepo = Repository.get("users", serviceConfig.db);

	if (data.currentUserId === data.userId) {
		return {
			error: {
				type: "basic",
				message: T("error_cant_delete_yourself"),
				status: 400,
			},
			data: undefined,
		};
	}

	await UsersServices.checks.checkNotLastUser(serviceConfig);

	const deleteUserRes = await UsersRepo.updateSingle({
		data: {
			isDeleted: 1,
			isDeletedAt: new Date().toISOString(),
			deletedBy: data.currentUserId,
		},
		where: [
			{
				key: "id",
				operator: "=",
				value: data.userId,
			},
		],
	});

	if (deleteUserRes === undefined) {
		return {
			error: {
				type: "basic",
				status: 500,
			},
			data: undefined,
		};
	}

	return {
		error: undefined,
		data: undefined,
	};
};

export default deleteSingle;
