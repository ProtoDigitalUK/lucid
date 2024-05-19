import T from "../../translations/index.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	code: string;
}

const getSingle = async (serviceConfig: ServiceConfig, data: ServiceData) => {
	const LocalesRepo = Repository.get("locales", serviceConfig.db);
	const LocalesFormatter = Formatter.get("locales");

	const configLocale = serviceConfig.config.localisation.locales.find(
		(locale) => locale.code === data.code,
	);

	if (!configLocale) {
		throw new LucidAPIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("locale"),
			}),
			message: T("error_not_found_message", {
				name: T("locale"),
			}),
			status: 404,
		});
	}

	const locale = await LocalesRepo.selectSingle({
		select: [
			"code",
			"created_at",
			"updated_at",
			"is_deleted",
			"is_deleted_at",
		],
		where: [
			{
				key: "code",
				operator: "=",
				value: data.code,
			},
			{
				key: "is_deleted",
				operator: "!=",
				value: 1,
			},
		],
	});

	if (locale === undefined) {
		throw new LucidAPIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("locale"),
			}),
			message: T("error_not_found_message", {
				name: T("locale"),
			}),
			status: 404,
		});
	}

	return LocalesFormatter.formatSingle({
		locale: locale,
		configLocale: configLocale,
		defaultLocale: serviceConfig.config.localisation.defaultLocale,
	});
};

export default getSingle;
