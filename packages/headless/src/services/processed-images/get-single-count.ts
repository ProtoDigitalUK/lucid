import { parseCount } from "../../utils/helpers.js";
import Repository from "../../libs/repositories/index.js";

export interface ServiceData {
	key: string;
}

const getSingleCount = async (
	serviceConfig: ServiceConfigT,
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

	return parseCount(processedImageCount?.count);
};

export default getSingleCount;
