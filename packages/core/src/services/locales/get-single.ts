import T from "../../translations/index.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { ServiceFn } from "../../libs/services/types.js";
import type { LocalesResponse } from "../../types/response.js";

const getSingle: ServiceFn<
	[
		{
			code: string;
		},
	],
	LocalesResponse
> = async (service, data) => {
	const LocalesRepo = Repository.get("locales", service.db);
	const LocalesFormatter = Formatter.get("locales");

	const configLocale = service.config.localisation.locales.find(
		(locale) => locale.code === data.code,
	);

	if (!configLocale) {
		return {
			error: {
				type: "basic",
				name: T("error_not_found_name", {
					name: T("locale"),
				}),
				message: T("error_not_found_message", {
					name: T("locale"),
				}),
				status: 404,
			},
			data: undefined,
		};
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
		return {
			error: {
				type: "basic",
				name: T("error_not_found_name", {
					name: T("locale"),
				}),
				message: T("error_not_found_message", {
					name: T("locale"),
				}),
				status: 404,
			},
			data: undefined,
		};
	}

	return {
		error: undefined,
		data: LocalesFormatter.formatSingle({
			locale: locale,
			configLocale: configLocale,
			defaultLocale: service.config.localisation.defaultLocale,
		}),
	};
};

export default getSingle;
