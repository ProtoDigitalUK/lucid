import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { ServiceFn } from "../../libs/services/types.js";

const getCount: ServiceFn<[], number> = async (serviceConfig) => {
	const ProcessedImagesRepo = Repository.get(
		"processed-images",
		serviceConfig.db,
	);

	const processedImageCount = await ProcessedImagesRepo.count({
		where: [],
	});
	return {
		error: undefined,
		data: Formatter.parseCount(processedImageCount?.count),
	};
};

export default getCount;
