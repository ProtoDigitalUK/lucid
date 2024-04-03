import { parseCount } from "../../utils/helpers.js";
import RepositoryFactory from "../../libs/factories/repository-factory.js";

// export interface ServiceData {}

const getCount = async (
	serviceConfig: ServiceConfigT,
	// data: ServiceData,
) => {
	const ProcessedImagesRepo = RepositoryFactory.getRepository(
		"processed-images",
		serviceConfig.db,
	);

	const processedImageCount = await ProcessedImagesRepo.count({
		where: [],
	});
	return parseCount(processedImageCount?.count);
};

export default getCount;
