import T from "../../translations/index.js";
import { HeadlessAPIError } from "../../utils/error-handler.js";
import crypto from "node:crypto";
import Repository from "../../libs/repositories/index.js";

export interface ServiceData {
	userId: number;
	tokenType: "password_reset";
	expiryDate: string;
}

const createSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const UserTokensRepo = Repository.get("user-tokens", serviceConfig.db);

	const token = crypto.randomBytes(32).toString("hex");

	const userToken = await UserTokensRepo.createSingle({
		userId: data.userId,
		tokenType: data.tokenType,
		expiryDate: data.expiryDate,
		token: token,
	});

	if (userToken === undefined) {
		throw new HeadlessAPIError({
			type: "basic",
			message: T("error_creating_user_token"),
			status: 500,
		});
	}

	return userToken;
};

export default createSingle;
