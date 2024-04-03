import T from "../../../translations/index.js";
import argon2 from "argon2";
import constants from "../../../constants.js";
import { InternalError } from "../../../utils/error-handler.js";
import { parseCount } from "../../../utils/helpers.js";
import RepositoryFactory from "../../factories/repository-factory.js";

const seedDefaultUser = async (serviceConfig: ServiceConfigT) => {
	try {
		const UsersRepo = RepositoryFactory.getRepository(
			"users",
			serviceConfig.db,
		);

		const totalUserCount = await UsersRepo.count();
		if (parseCount(totalUserCount?.count) > 0) return;

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
		throw new InternalError(
			T("dynamic_an_error_occurred_saving_default", {
				name: T("user").toLowerCase(),
			}),
		);
	}
};

export default seedDefaultUser;
