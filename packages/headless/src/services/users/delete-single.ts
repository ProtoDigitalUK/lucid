import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";

export interface ServiceData {
	user_id: number;
	current_user_id: number;
}

const deleteSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const deleteUserRes = await serviceConfig.db
		.updateTable("headless_users")
		.set({
			is_deleted: true,
			is_deleted_at: new Date(),
			deleted_by: data.current_user_id,
		})
		.where("id", "=", data.user_id)
		.returning("id")
		.executeTakeFirst();

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
