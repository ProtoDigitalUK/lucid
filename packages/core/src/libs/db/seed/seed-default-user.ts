import T from "../../../translations/index.js";
import argon2 from "argon2";
import constants from "../../../constants.js";
import { LucidError } from "../../../utils/error-handler.js";
import Repository from "../../repositories/index.js";
import Formatter from "../../formatters/index.js";
import type { ServiceConfig } from "../../services/types.js";

const seedDefaultUser = async (service: ServiceConfig) => {
	try {
		const UsersRepo = Repository.get("users", service.db);

		const totalUserCount = await UsersRepo.count();
		if (Formatter.parseCount(totalUserCount?.count) > 0) return;

		const hashedPassword = await argon2.hash(
			constants.seedDefaults.user.password,
		);

		await UsersRepo.createSingle({
			superAdmin: constants.seedDefaults.user.superAdmin as 0 | 1,
			email: constants.seedDefaults.user.email,
			username: constants.seedDefaults.user.username,
			firstName: constants.seedDefaults.user.firstName,
			lastName: constants.seedDefaults.user.lastName,
			triggerPasswordReset: 1,
			password: hashedPassword,
		});
	} catch (error) {
		throw new LucidError({
			message: T("user_error_occured_saving_default"),
		});
	}
};

export default seedDefaultUser;
