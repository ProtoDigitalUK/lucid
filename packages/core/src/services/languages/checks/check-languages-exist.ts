import T from "../../../translations/index.js";
import { LucidAPIError } from "../../../utils/error-handler.js";
import Repository from "../../../libs/repositories/index.js";
import type { ServiceConfig } from "../../../utils/service-wrapper.js";

export interface ServiceData {
	languageCodes: string[];
}

const checkLanguagesExist = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	const languageCodes = Array.from(new Set(data.languageCodes));

	if (languageCodes.length === 0) return;

	const LanguagesRepo = Repository.get("languages", serviceConfig.db);

	const languages = await LanguagesRepo.selectMultiple({
		select: ["code"],
		where: [
			{
				key: "code",
				operator: "in",
				value: languageCodes,
			},
		],
	});

	if (languages.length !== languageCodes.length) {
		throw new LucidAPIError({
			type: "basic",
			status: 400,
			errorResponse: {
				body: {
					translations: {
						code: "invalid",
						message: T(
							"make_sure_all_translations_languages_exist",
						),
					},
				},
			},
		});
	}
};

export default checkLanguagesExist;
