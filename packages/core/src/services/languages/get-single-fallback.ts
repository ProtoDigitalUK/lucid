import T from "../../translations/index.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import Repository from "../../libs/repositories/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	code?: string;
}

const getSingleFallback = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	const LanguagesRepo = Repository.get("languages", serviceConfig.db);

	if (data.code !== undefined) {
		const language = await LanguagesRepo.selectSingle({
			select: ["code"],
			where: [
				{
					key: "code",
					operator: "=",
					value: data.code,
				},
			],
		});

		if (language === undefined) {
			throw new LucidAPIError({
				type: "basic",
				name: T("error_not_found_name", {
					name: T("language"),
				}),
				message: T("error_not_found_message", {
					name: T("language"),
				}),
				status: 404,
			});
		}

		return {
			code: language.code,
		};
	}

	const defaultLanguage = await LanguagesRepo.selectSingle({
		select: ["code"],
		where: [
			{
				key: "is_default",
				operator: "=",
				value: 1,
			},
		],
	});

	if (defaultLanguage === undefined) {
		throw new LucidAPIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("language"),
			}),
			message: T("error_not_found_message", {
				name: T("language"),
			}),
			status: 404,
		});
	}

	return {
		code: defaultLanguage.code,
	};
};

export default getSingleFallback;
