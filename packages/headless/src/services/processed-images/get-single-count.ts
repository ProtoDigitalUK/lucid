import { parseCount } from "../../utils/helpers.js";
import RepositoryFactory from "../../libs/factories/repository-factory.js";

export interface ServiceData {
	key: string;
}

const getSingleCount = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const ProcessedImagesRepo = RepositoryFactory.getRepository(
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

	return parseCount(processedImageCount?.count);
};

export default getSingleCount;
