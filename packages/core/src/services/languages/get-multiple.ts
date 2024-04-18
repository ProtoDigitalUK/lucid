import type z from "zod";
import type languagesSchema from "../../schemas/languages.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	query: z.infer<typeof languagesSchema.getMultiple.query>;
}

const getMultiple = async (serviceConfig: ServiceConfig, data: ServiceData) => {
	const LanguagesRepo = Repository.get("languages", serviceConfig.db);
	const LanguagesFormatter = Formatter.get("languages");

	const [languages, count] = await LanguagesRepo.selectMultipleFiltered({
		query: data.query,
	});

	return {
		data: LanguagesFormatter.formatMultiple({
			languages: languages,
		}),
		count: Formatter.parseCount(count?.count),
	};
};

export default getMultiple;
