import T from "../../translations/index.js";
import { HeadlessAPIError } from "../../utils/error-handler.js";
import Repository from "../../libs/repositories/index.js";

export interface ServiceData {
	user_id: number;
	current_user_id: number;
}

const deleteSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const UsersRepo = Repository.get("users", serviceConfig.db);

	const deleteUserRes = await UsersRepo.updateSingle({
		data: {
			isDeleted: 1,
			isDeletedAt: new Date().toISOString(),
			deletedBy: data.current_user_id,
		},
		where: [
			{
				key: "id",
				operator: "=",
				value: data.user_id,
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
