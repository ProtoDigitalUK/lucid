import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import crypto from "node:crypto";
import RepositoryFactory from "../../repositories/repository-factory.js";

export interface ServiceData {
	user_id: number;
	token_type: "password_reset";
	expiry_date: string;
}

const createSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const service = RepositoryFactory.getRepository(
		"user-tokens",
		serviceConfig.config,
	);

	const token = crypto.randomBytes(32).toString("hex");

	const userToken = await service.createSingle({
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
