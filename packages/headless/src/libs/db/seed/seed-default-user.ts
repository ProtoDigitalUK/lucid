import T from "../../../translations/index.js";
import argon2 from "argon2";
import constants from "../../../constants.js";
import { HeadlessError } from "../../../utils/errors.js";
import Repository from "../../repositories/index.js";
import Formatter from "../../formatters/index.js";

const seedDefaultUser = async (serviceConfig: ServiceConfigT) => {
	try {
		const UsersRepo = Repository.get("users", serviceConfig.db);

		const totalUserCount = await UsersRepo.count();
		if (Formatter.parseCount(totalUserCount?.count) > 0) return;

		const hashedPassword = await argon2.hash(
			constants.seedDefaults.user.password,
		);

		await UsersRepo.createSingle({
			superAdmin: constants.seedDefaults.user.super_admin as 0 | 1,
			email: constants.seedDefaults.user.email,
			username: constants.seedDefaults.user.username,
			firstName: constants.seedDefaults.user.first_name,
			lastName: constants.seedDefaults.user.last_name,
			password: hashedPassword,
		});
	} catch (error) {
		throw new HeadlessError({
			message: T("dynamic_an_error_occurred_saving_default", {
				name: T("user").toLowerCase(),
			}),
		});
	}
};

export default seedDefaultUser;
