import { parseCount } from "../../utils/helpers.js";
import Repository from "../../libs/repositories/index.js";

// export interface ServiceData {}

const getCount = async (
	serviceConfig: ServiceConfigT,
	// data: ServiceData,
) => {
	const ProcessedImagesRepo = Repository.get(
		"processed-images",
		serviceConfig.db,
	);

	const processedImageCount = await ProcessedImagesRepo.count({
		where: [],
	});
	return parseCount(processedImageCount?.count);
};

export default getCount;
