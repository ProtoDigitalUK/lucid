import T from "../translations/index.js";
import argon2 from "argon2";
import { type FastifyInstance } from "fastify";
import constants from "../constants.js";
import { InternalError } from "../utils/app/error-handler.js";
import { sql } from "kysely";
import { parseCount } from "../utils/app/helpers.js";

const addDefaultUser = async (db: DB) => {
	try {
		const totalUserCount = (await db
			.selectFrom("headless_users")
			.select(sql`count(*)`.as("count"))
			.executeTakeFirst()) as { count: string } | undefined;

		if (parseCount(totalUserCount?.count) === 0) {
			const hashedPassword = await argon2.hash(
				constants.seedDefaults.user.password,
			);
			await db
				.insertInto("headless_users")
				.values({
					super_admin: constants.seedDefaults.user.super_admin,
					email: constants.seedDefaults.user.email,
					username: constants.seedDefaults.user.username,
					first_name: constants.seedDefaults.user.first_name,
					last_name: constants.seedDefaults.user.last_name,
					password: hashedPassword,
				})
				.execute();
		}
	} catch (error) {
		throw new InternalError(
			T("dynamic_an_error_occurred_saving_default", {
				name: T("user"),
			}),
		);
	}
};

const addDefaultLanguage = async (db: DB) => {
	try {
		const totalLanguagesCount = (await db
			.selectFrom("headless_languages")
			.select(sql`count(*)`.as("count"))
			.executeTakeFirst()) as { count: string } | undefined;

		if (parseCount(totalLanguagesCount?.count) === 0) {
			await db
				.insertInto("headless_languages")
				.values({
					code: constants.seedDefaults.language.code,
					is_default: constants.seedDefaults.language.is_default,
					is_enabled: constants.seedDefaults.language.is_enabled,
				})
				.execute();
		}
	} catch (error) {
		throw new InternalError(
			T("dynamic_an_error_occurred_saving_default", {
				name: T("language"),
			}),
		);
	}
};

const addDefaultEnvironment = async (db: DB) => {
	try {
		const totalEnvrionmentcount = (await db
			.selectFrom("headless_environments")
			.select(sql`count(*)`.as("count"))
			.executeTakeFirst()) as { count: string } | undefined;

		if (parseCount(totalEnvrionmentcount?.count) === 0) {
			await db
				.insertInto("headless_environments")
				.values({
					key: constants.seedDefaults.environment.key,
					title: constants.seedDefaults.environment.title,
				})
				.execute();
		}
	} catch (error) {
		throw new InternalError(
			T("dynamic_an_error_occurred_saving_default", {
				name: T("environment"),
			}),
		);
	}
};

const seedHeadless = async (fastify: FastifyInstance) => {
	await Promise.allSettled([
		addDefaultUser(fastify.db),
		addDefaultLanguage(fastify.db),
		addDefaultEnvironment(fastify.db),
	]);
};

export default seedHeadless;
