import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import RepositoryFactory from "../../repositories/repository-factory.js";

export interface ServiceData {
	token_type: "password_reset";
	token: string;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const service = RepositoryFactory.getRepository(
		"user-tokens",
		serviceConfig.config,
	);

	const userToken = await service.getSingle({
		token: data.token,
		tokenType: data.token_type,
		expiryDate: new Date().toISOString(),
	});

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
