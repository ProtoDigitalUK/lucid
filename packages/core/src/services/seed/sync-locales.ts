import Repository from "../../libs/repositories/index.js";
import type { ServiceConfig, ServiceFn } from "../../utils/services/types.js";

const defaultRoles: ServiceFn<[], undefined> = async (
	service: ServiceConfig,
) => {
	// Responsible for syncing locales config with the database
	const LocalesRepo = Repository.get("locales", service.db);
	const localeCodes = service.config.localisation.locales.map(
		(locale) => locale.code,
	);

	// Actions
	// - If a locale exists in config but not in the database, create it
	// - If a locale exists in the database but not in config, mark as is_deleted

	// Get all locales
	const locales = await LocalesRepo.selectAll({
		select: ["code", "is_deleted"],
	});

	// Get locale codes from the database
	const localeCodesFromDB = locales.map((locale) => locale.code);

	// Get locale codes that are in the config but not in the database
	const missingLocales = localeCodes.filter(
		(locale) => !localeCodesFromDB.includes(locale),
	);

	// Get locale codes that are in the database but not in the config
	const extraLocales = localeCodesFromDB.filter(
		(locale) => !localeCodes.includes(locale),
	);

	// Get locals that are in the database as is_deleted but in the config
	const unDeletedLocales = locales.filter(
		(locale) =>
			locale.is_deleted === 1 && localeCodes.includes(locale.code),
	);
	const unDeletedLocalesCodes = unDeletedLocales.map((locale) => locale.code);

	await Promise.all([
		missingLocales.length > 0 &&
			LocalesRepo.createMultiple({
				items: missingLocales.map((locale) => ({
					code: locale,
				})),
			}),
		extraLocales.length > 0 &&
			LocalesRepo.updateSingle({
				data: {
					isDeleted: 1,
					isDeletedAt: new Date().toISOString(),
				},
				where: [
					{
						key: "code",
						operator: "in",
						value: extraLocales,
					},
				],
			}),
		unDeletedLocalesCodes.length > 0 &&
			LocalesRepo.updateSingle({
				data: {
					isDeleted: 0,
				},
				where: [
					{
						key: "code",
						operator: "in",
						value: unDeletedLocales.map((locale) => locale.code),
					},
				],
			}),
	]);

	return {
		error: undefined,
		data: undefined,
	};
};

export default defaultRoles;
