import type z from "zod";
import formatMedia from "../../format/format-media.js";
import type mediaSchema from "../../schemas/media.js";
import { parseCount } from "../../utils/helpers.js";
import Repository from "../../libs/repositories/index.js";

export interface ServiceData {
	query: z.infer<typeof mediaSchema.getMultiple.query>;
	language_id: number;
}

const getMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const MediaRepo = Repository.get("media", serviceConfig.db);

	const [medias, mediasCount] = await MediaRepo.selectMultipleFiltered({
		languageId: data.language_id,
		query: data.query,
		config: serviceConfig.config,
	});

	return {
		data: medias.map((media) =>
			formatMedia({
				media: media,
				host: serviceConfig.config.host,
			}),
		),
		count: parseCount(mediasCount?.count),
	};
};

export default getMultiple;
