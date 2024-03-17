import T from "../translations/index.js";
import argon2 from "argon2";
import constants from "../constants.js";
import { InternalError } from "../utils/app/error-handler.js";
import { sql } from "kysely";
import { parseCount } from "../utils/app/helpers.js";
import serviceWrapper from "../utils/app/service-wrapper.js";
import rolesServices from "./roles/index.js";
import collectionsServices from "./collections/index.js";

const addDefaultUser = async (serviceConfig: ServiceConfigT) => {
	try {
		const totalUserCount = (await serviceConfig.db
			.selectFrom("headless_users")
			.select(sql`count(*)`.as("count"))
			.executeTakeFirst()) as { count: string } | undefined;

		if (parseCount(totalUserCount?.count) > 0) return;

		const hashedPassword = await argon2.hash(
			constants.seedDefaults.user.password,
		);
		await serviceConfig.db
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
	} catch (error) {
		throw new InternalError(
			T("dynamic_an_error_occurred_saving_default", {
				name: T("user").toLowerCase(),
			}),
		);
	}
};

const addDefaultLanguage = async (serviceConfig: ServiceConfigT) => {
	try {
		const totalLanguagesCount = (await serviceConfig.db
			.selectFrom("headless_languages")
			.select(sql`count(*)`.as("count"))
			.executeTakeFirst()) as { count: string } | undefined;

		if (parseCount(totalLanguagesCount?.count) > 0) return;

		await serviceConfig.db
			.insertInto("headless_languages")
			.values({
				code: constants.seedDefaults.language.code,
				is_default: constants.seedDefaults.language.is_default,
				is_enabled: constants.seedDefaults.language.is_enabled,
			})
			.execute();
	} catch (error) {
		throw new InternalError(
			T("dynamic_an_error_occurred_saving_default", {
				name: T("language").toLowerCase(),
			}),
		);
	}
};

const addDefaultRoles = async (serviceConfig: ServiceConfigT) => {
	try {
		const totalRoleCount = (await serviceConfig.db
			.selectFrom("headless_roles")
			.select(sql`count(*)`.as("count"))
			.executeTakeFirst()) as { count: string } | undefined;

		if (parseCount(totalRoleCount?.count) > 0) return;

		const rolePromises = [];
		for (const role of constants.seedDefaults.roles) {
			rolePromises.push(
				serviceWrapper(rolesServices.createSingle, false)(
					{
						db: serviceConfig.db,
					},
					{
						name: role.name,
						description: role.description,
						permissions: role.permissions,
					},
				),
			);
		}
		await Promise.all(rolePromises);
	} catch (error) {
		throw new InternalError(
			T("dynamic_an_error_occurred_saving_default", {
				name: T("roles").toLowerCase(),
			}),
		);
	}
};

const addDefaultCollection = async (serviceConfig: ServiceConfigT) => {
	try {
		const totalCollectionCount = (await serviceConfig.db
			.selectFrom("headless_collections")
			.select(sql`count(*)`.as("count"))
			.executeTakeFirst()) as { count: string } | undefined;

		if (parseCount(totalCollectionCount?.count) > 0) return;

		await serviceWrapper(collectionsServices.createSingle, false)(
			{
				db: serviceConfig.db,
			},
			{
				key: constants.seedDefaults.collection.key,
				type: constants.seedDefaults.collection.type,
				title: constants.seedDefaults.collection.title,
				singular: constants.seedDefaults.collection.singular,
				description: constants.seedDefaults.collection.description,
			},
		);
	} catch (error) {
		throw new InternalError(
			T("dynamic_an_error_occurred_saving_default", {
				name: T("collection").toLowerCase(),
			}),
		);
	}
};

const seedHeadless = async (serviceConfig: ServiceConfigT) => {
	await Promise.allSettled([
		addDefaultUser(serviceConfig),
		addDefaultLanguage(serviceConfig),
		addDefaultRoles(serviceConfig),
		addDefaultCollection(serviceConfig),
	]);
};

export default seedHeadless;
