import type z from "zod";
import type mediaSchema from "../../schemas/media.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	query: z.infer<typeof mediaSchema.getMultiple.query>;
	languageId: number;
}

const getMultiple = async (serviceConfig: ServiceConfig, data: ServiceData) => {
	const MediaRepo = Repository.get("media", serviceConfig.db);
	const MediaFormatter = Formatter.get("media");

	const [medias, mediasCount] = await MediaRepo.selectMultipleFiltered({
		languageId: data.languageId,
		query: data.query,
		config: serviceConfig.config,
	});

	return {
		data: MediaFormatter.formatMultiple({
			media: medias,
			host: serviceConfig.config.host,
		}),
		count: Formatter.parseCount(mediasCount?.count),
	};
};

export default getMultiple;
