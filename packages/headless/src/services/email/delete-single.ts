import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";

export interface ServiceData {
	id: number;
}

const deleteSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const deleteEmail = await serviceConfig.db
		.deleteFrom("headless_emails")
		.where("id", "=", data.id)
		.executeTakeFirst();

	if (deleteEmail.numDeletedRows === 0n) {
		throw new APIError({
			type: "basic",
			name: T("dynamic_error_name", {
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
