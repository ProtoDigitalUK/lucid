import type z from "zod";
import formatLanguage from "../../format/format-language.js";
import type languagesSchema from "../../schemas/languages.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";

export interface ServiceData {
	query: z.infer<typeof languagesSchema.getMultiple.query>;
}

const getMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const LanguagesRepo = Repository.get("languages", serviceConfig.db);

	const [languages, count] = await LanguagesRepo.selectMultipleFiltered({
		query: data.query,
	});

	return {
		data: languages.map((l) => {
			return formatLanguage({
				language: l,
			});
		}),
		count: Formatter.parseCount(count?.count),
	};
};

export default getMultiple;
