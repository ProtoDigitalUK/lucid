import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import crypto from "crypto";

export interface ServiceData {
	userId: number;
	tokenType: "password_reset";
	expiryDate: string;
}

const createSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const token = crypto.randomBytes(32).toString("hex");

	const userToken = await serviceConfig.db
		.insertInto("headless_user_tokens")
		.values({
			user_id: data.userId,
			token: token,
			token_type: data.tokenType,
			expiry_date: data.expiryDate,
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
