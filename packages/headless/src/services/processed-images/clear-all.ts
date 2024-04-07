import Repository from "../../libs/repositories/index.js";
import mediaServices from "../media/index.js";

const clearAll = async (serviceConfig: ServiceConfigT) => {
	const mediaStategy = mediaServices.checks.checkHasMediaStrategy({
		config: serviceConfig.config,
	});

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
		mediaStategy.deleteMultiple(allProcessedImages.map((i) => i.key)),
		ProcessedImagesRepo.deleteMultiple({
			where: [],
		}),
	]);
};

export default clearAll;
