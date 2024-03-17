import T from "../../../translations/index.js";
import { APIError, modelErrors } from "../../../utils/app/error-handler.js";

export interface ServiceData {
	language_ids: number[];
}

const checkLanguagesExist = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const languageIds = Array.from(new Set(data.language_ids));

	if (languageIds.length === 0) return;

	const languages = await serviceConfig.db
		.selectFrom("headless_languages")
		.select("id")
		.where("id", "in", languageIds)
		.execute();

	if (languages.length !== languageIds.length) {
		throw new APIError({
			type: "basic",
			name: T("error_not_created_name", {
				name: T("translation"),
			}),
			message: T("error_not_created_message", {
				name: T("translation"),
			}),
			status: 400,
			errors: modelErrors({
				translations: {
					code: "invalid",
					message: T("make_sure_all_translations_languages_exist"),
				},
			}),
		});
	}
};

export default checkLanguagesExist;
