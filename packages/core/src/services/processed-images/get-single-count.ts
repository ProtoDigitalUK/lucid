import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { ServiceFn } from "../../libs/services/types.js";

const getSingleCount: ServiceFn<
	[
		{
			key: string;
		},
	],
	number
> = async (serviceConfig, data) => {
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

	return {
		error: undefined,
		data: Formatter.parseCount(processedImageCount?.count),
	};
};

export default getSingleCount;
