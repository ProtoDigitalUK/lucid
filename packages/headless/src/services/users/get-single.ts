import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import FormatterFactory from "../../libs/factories/formatter-factory.js";
import RepositoryFactory from "../../libs/factories/repository-factory.js";

export interface ServiceData {
	user_id: number;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const UsersRepo = RepositoryFactory.getRepository(
		"users",
		serviceConfig.db,
	);
	const UsersFormatter = FormatterFactory.getFormatter("users");

	const user = await UsersRepo.selectSingleById({
		id: data.user_id,
		config: serviceConfig.config,
	});

	if (!user) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("user"),
			}),
			message: T("error_not_found_message", {
				name: T("user"),
			}),
			status: 404,
		});
	}

	return UsersFormatter.formatSingle({
		user: user,
	});
};

export default getSingle;
