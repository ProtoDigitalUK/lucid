import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import crypto from "node:crypto";
import Repository from "../../libs/repositories/index.js";

export interface ServiceData {
	user_id: number;
	token_type: "password_reset";
	expiry_date: string;
}

const createSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const UserTokensRepo = Repository.get("user-tokens", serviceConfig.db);

	const token = crypto.randomBytes(32).toString("hex");

	const userToken = await UserTokensRepo.createSingle({
		userId: data.user_id,
		tokenType: data.token_type,
		expiryDate: data.expiry_date,
		token: token,
	});

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
