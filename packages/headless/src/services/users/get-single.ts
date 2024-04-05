import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import Formatter from "../../libs/formatters/index.js";
import Repository from "../../libs/repositories/index.js";

export interface ServiceData {
	user_id: number;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const UsersRepo = Repository.get("users", serviceConfig.db);
	const UsersFormatter = Formatter.get("users");

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
