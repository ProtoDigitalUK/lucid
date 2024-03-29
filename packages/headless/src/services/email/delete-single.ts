import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";

export interface ServiceData {
	id: number;
}

const deleteSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const deleteEmail = await serviceConfig.config.db.client
		.deleteFrom("headless_emails")
		.where("id", "=", data.id)
		.executeTakeFirst();

	if (deleteEmail.numDeletedRows === 0n) {
		throw new APIError({
			type: "basic",
			name: T("error_not_deleted_name", {
				name: T("email"),
			}),
			message: T("deletion_error_message", {
				name: T("email").toLowerCase(),
			}),
			status: 500,
		});
	}
};

export default deleteSingle;
