import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";

export interface ServiceData {
	code: string;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const LanguagesRepo = Repository.get("languages", serviceConfig.db);
	const LanguagesFormatter = Formatter.get("languages");

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

	return LanguagesFormatter.formatSingle({
		language: language,
	});
};

export default getSingle;
