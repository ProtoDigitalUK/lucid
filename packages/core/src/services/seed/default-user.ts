import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import constants from "../../constants/constants.js";
import argon2 from "argon2";
import type { ServiceContext, ServiceFn } from "../../utils/services/types.js";

const defaultUser: ServiceFn<[], undefined> = async (
	context: ServiceContext,
) => {
	const UsersRepo = Repository.get("users", context.db);

	const totalUserCount = await UsersRepo.count();
	if (Formatter.parseCount(totalUserCount?.count) > 0) {
		return {
			error: undefined,
			data: undefined,
		};
	}

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

	return {
		error: undefined,
		data: undefined,
	};
};

export default defaultUser;
