import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import formatLanguage from "../../format/format-language.js";
import Repository from "../../libs/repositories/index.js";

export interface ServiceData {
	code: string;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const LanguagesRepo = Repository.get("languages", serviceConfig.db);

	const language = await LanguagesRepo.selectSingle({
		select: [
			"code",
			"id",
			"created_at",
			"is_default",
			"is_enabled",
			"updated_at",
		],
		where: [
			{
				key: "code",
				operator: "=",
				value: data.code,
			},
		],
	});

	if (language === undefined) {
		throw new APIError({
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

	return formatLanguage({
		language: language,
	});
};

export default getSingle;
