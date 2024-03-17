import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import formatLanguage from "../../format/format-language.js";

export interface ServiceData {
	code: string;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const language = await serviceConfig.db
		.selectFrom("headless_languages")
		.selectAll()
		.where("code", "=", data.code)
		.executeTakeFirst();

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

	return formatLanguage(language);
};

export default getSingle;
