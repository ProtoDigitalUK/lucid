import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";

export interface ServiceData {
	id: number;
}

const deleteSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const deleteRoles = await serviceConfig.config.db.client
		.deleteFrom("headless_roles")
		.where("id", "=", data.id)
		.executeTakeFirst();

	if (deleteRoles.numDeletedRows === 0n) {
		throw new APIError({
			type: "basic",
			name: T("error_not_deleted_name", {
				name: T("role"),
			}),
			message: T("deletion_error_message", {
				name: T("role").toLowerCase(),
			}),
			status: 500,
		});
	}
};

export default deleteSingle;
