import T from "../../translations/index.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import Repository from "../../libs/repositories/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	id?: number;
}

const getSingleFallback = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	const LanguagesRepo = Repository.get("languages", serviceConfig.db);

	if (data.id !== undefined) {
		const language = await LanguagesRepo.selectSingle({
			select: ["id", "code"],
			where: [
				{
					key: "id",
					operator: "=",
					value: data.id,
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
			id: language.id,
			code: language.code,
		};
	}

	const defaultLanguage = await LanguagesRepo.selectSingle({
		select: ["id", "code"],
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
		id: defaultLanguage.id,
		code: defaultLanguage.code,
	};
};

export default getSingleFallback;
