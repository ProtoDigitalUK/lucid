import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

// export interface ServiceData {}

const getCount = async (
	serviceConfig: ServiceConfig,
	// data: ServiceData,
) => {
	const ProcessedImagesRepo = Repository.get(
		"processed-images",
		serviceConfig.db,
	);

	const processedImageCount = await ProcessedImagesRepo.count({
		where: [],
	});
	return Formatter.parseCount(processedImageCount?.count);
};

export default getCount;
