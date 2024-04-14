import T from "../../../translations/index.js";
import { HeadlessAPIError } from "../../../utils/error-handler.js";
import Repository from "../../../libs/repositories/index.js";

export interface ServiceData {
	language_ids: number[];
}

const checkLanguagesExist = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const languageIds = Array.from(new Set(data.language_ids));

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
