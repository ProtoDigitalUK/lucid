import T from "../../../translations/index.js";
import { LucidAPIError } from "../../../utils/error-handler.js";
import Formatter from "../../../libs/formatters/index.js";
import Repository from "../../../libs/repositories/index.js";
import type { ServiceConfig } from "../../../utils/service-wrapper.js";

const checkNotLastUser = async (serviceConfig: ServiceConfig) => {
	const UsersRepo = Repository.get("users", serviceConfig.db);

	const activeUserCountRes = await UsersRepo.activeCount();
	const activeUserCount = Formatter.parseCount(activeUserCountRes?.count);
	if (activeUserCount <= 1) {
		throw new LucidAPIError({
			type: "basic",
			message: T("error_cant_delete_last_user"),
			status: 400,
		});
	}
};

export default checkNotLastUser;
