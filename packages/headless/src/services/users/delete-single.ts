import { HeadlessAPIError } from "../../utils/error-handler.js";
import Repository from "../../libs/repositories/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	userId: number;
	currentUserId: number;
}

const deleteSingle = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	const UsersRepo = Repository.get("users", serviceConfig.db);

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
		throw new HeadlessAPIError({
			type: "basic",
			status: 500,
		});
	}
};

export default deleteSingle;
