import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import formatUser from "../../format/format-user.js";
import RepositoryFactory from "../../libs/factories/repository-factory.js";

export interface ServiceData {
	user_id: number;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const UsersRepo = RepositoryFactory.getRepository(
		"users",
		serviceConfig.db,
	);

	const user = await UsersRepo.getSingleWithRoles({
		userId: data.user_id,
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

	return formatUser({
		user: user,
	});
};

export default getSingle;
