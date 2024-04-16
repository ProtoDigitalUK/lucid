import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	key: string;
}

const getSingleCount = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	const ProcessedImagesRepo = Repository.get(
		"processed-images",
		serviceConfig.db,
	);

	const processedImageCount = await ProcessedImagesRepo.count({
		where: [
			{
				key: "media_key",
				operator: "=",
				value: data.key,
			},
		],
	});

	return Formatter.parseCount(processedImageCount?.count);
};

export default getSingleCount;
