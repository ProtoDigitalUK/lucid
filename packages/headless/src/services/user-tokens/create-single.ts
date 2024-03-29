import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import crypto from "node:crypto";

export interface ServiceData {
	user_id: number;
	token_type: "password_reset";
	expiry_date: string;
}

const createSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const token = crypto.randomBytes(32).toString("hex");

	const userToken = await serviceConfig.config.db.client
		.insertInto("headless_user_tokens")
		.values({
			user_id: data.user_id,
			token: token,
			token_type: data.token_type,
			expiry_date: data.expiry_date,
		})
		.returning("token")
		.executeTakeFirst();

	if (userToken === undefined) {
		throw new APIError({
			type: "basic",
			name: T("default_error_name"),
			message: T("error_creating_user_token"),
			status: 500,
		});
	}

	return userToken;
};

export default createSingle;
