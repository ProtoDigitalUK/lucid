import type z from "zod";
import formatLanguage from "../../format/format-language.js";
import type languagesSchema from "../../schemas/languages.js";
import { parseCount } from "../../utils/helpers.js";
import RepositoryFactory from "../../libs/repositories/index.js";

export interface ServiceData {
	query: z.infer<typeof languagesSchema.getMultiple.query>;
}

const getMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const LanguagesRepo = RepositoryFactory.getRepository(
		"languages",
		serviceConfig.db,
	);

	const [languages, count] = await LanguagesRepo.selectMultipleFiltered({
		query: data.query,
	});

	return {
		data: languages.map((l) => {
			return formatLanguage({
				language: l,
			});
		}),
		count: parseCount(count?.count),
	};
};

export default getMultiple;
