import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
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
		throw new APIError({
			type: "basic",
			name: T("error_not_deleted_name", {
				name: T("user"),
			}),
			message: T("deletion_error_message", {
				name: T("user").toLowerCase(),
			}),
			status: 500,
		});
	}
};

export default deleteSingle;
