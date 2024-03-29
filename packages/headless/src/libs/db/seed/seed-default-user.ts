import T from "../../../translations/index.js";
import { sql } from "kysely";
import argon2 from "argon2";
import constants from "../../../constants.js";
import { InternalError } from "../../../utils/error-handler.js";
import { parseCount } from "../../../utils/helpers.js";

const seedDefaultUser = async (serviceConfig: ServiceConfigT) => {
	try {
		const totalUserCount = (await serviceConfig.config.db.client
			.selectFrom("headless_users")
			.select(sql`count(*)`.as("count"))
			.executeTakeFirst()) as { count: string } | undefined;

		if (parseCount(totalUserCount?.count) > 0) return;

		const hashedPassword = await argon2.hash(
			constants.seedDefaults.user.password,
		);
		await serviceConfig.config.db.client
			.insertInto("headless_users")
			.values({
				super_admin: constants.seedDefaults.user.super_admin as 0 | 1,
				email: constants.seedDefaults.user.email,
				username: constants.seedDefaults.user.username,
				first_name: constants.seedDefaults.user.first_name,
				last_name: constants.seedDefaults.user.last_name,
				password: hashedPassword,
			})
			.execute();
	} catch (error) {
		throw new InternalError(
			T("dynamic_an_error_occurred_saving_default", {
				name: T("user").toLowerCase(),
			}),
		);
	}
};

export default seedDefaultUser;
