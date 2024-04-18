import T from "../../../translations/index.js";
import { HeadlessAPIError } from "../../../utils/error-handler.js";
import Repository from "../../../libs/repositories/index.js";
import type { ServiceConfig } from "../../../utils/service-wrapper.js";

export interface ServiceData {
	languageIds: number[];
}

const checkLanguagesExist = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	const languageIds = Array.from(new Set(data.languageIds));

	if (languageIds.length === 0) return;

	const LanguagesRepo = Repository.get("languages", serviceConfig.db);

	const languages = await LanguagesRepo.selectMultiple({
		select: ["id"],
		where: [
			{
				key: "id",
				operator: "in",
				value: languageIds,
			},
		],
	});

	if (languages.length !== languageIds.length) {
		throw new HeadlessAPIError({
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
