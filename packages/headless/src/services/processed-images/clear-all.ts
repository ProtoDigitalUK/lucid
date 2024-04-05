import s3Services from "../s3/index.js";
import Repository from "../../libs/repositories/index.js";

const clearAll = async (serviceConfig: ServiceConfigT) => {
	const ProcessedImagesRepo = Repository.get(
		"processed-images",
		serviceConfig.db,
	);

	const allProcessedImages = await ProcessedImagesRepo.selectMultiple({
		select: ["key"],
		where: [],
	});

	if (allProcessedImages.length === 0) return;

	await Promise.all([
		s3Services.deleteObjects({
			objects: allProcessedImages.map((image) => ({
				key: image.key,
			})),
		}),
		ProcessedImagesRepo.deleteMultiple({
			where: [],
		}),
	]);
};

export default clearAll;
