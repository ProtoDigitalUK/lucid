import T from "../translations/index.js";
import argon2 from "argon2";
import { type FastifyInstance } from "fastify";
import { sql } from "drizzle-orm";
import { users } from "../db/schema.js";
import constants from "../constants.js";
import { InternalError } from "../utils/app/error-handler.js";

// export interface ServiceDataT {}

const addDefaultUser = async (db: DB) => {
	try {
		const totalUserCount = await db
			.select({ count: sql<number>`count(*)`.mapWith(Number) })
			.from(users);
		const userCount = totalUserCount[0].count;

		if (userCount === 0) {
			const hashedPassword = await argon2.hash(constants.defaultUser.password);
			await db
				.insert(users)
				.values({
					super_admin: constants.defaultUser.super_admin,
					email: constants.defaultUser.email,
					username: constants.defaultUser.username,
					first_name: constants.defaultUser.first_name,
					last_name: constants.defaultUser.last_name,
					password: hashedPassword,
				})
				.execute();
		}
	} catch (error) {
		throw new InternalError(T("an_error_occurred_saving_default_user"));
	}
};

const seedHeadless = async (fastify: FastifyInstance) => {
	await addDefaultUser(fastify.db);
};

export default seedHeadless;
