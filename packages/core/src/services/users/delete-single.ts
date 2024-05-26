import T from "../../translations/index.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import Repository from "../../libs/repositories/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";
import UsersServices from "./index.js";

export interface ServiceData {
	userId: number;
	currentUserId: number;
}

const deleteSingle = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	const UsersRepo = Repository.get("users", serviceConfig.db);

	if (data.currentUserId === data.userId) {
		throw new LucidAPIError({
			type: "basic",
			message: T("error_cant_delete_yourself"),
			status: 400,
		});
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
		throw new LucidAPIError({
			type: "basic",
			status: 500,
		});
	}
};

export default deleteSingle;
