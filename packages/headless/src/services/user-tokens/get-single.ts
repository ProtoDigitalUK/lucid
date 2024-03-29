import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";

export interface ServiceData {
	token_type: "password_reset";
	token: string;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const userToken = await serviceConfig.config.db.client
		.selectFrom("headless_user_tokens")
		.select(["id", "user_id"])
		.where("token", "=", data.token)
		.where("token_type", "=", data.token_type)
		.where("expiry_date", ">", new Date())
		.executeTakeFirst();

	if (userToken === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("token"),
			}),
			message: T("error_not_found_message", {
				name: T("token"),
			}),
			status: 404,
		});
	}

	return userToken;
};

export default getSingle;
