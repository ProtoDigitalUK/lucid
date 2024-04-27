import Repository from "../../libs/repositories/index.js";
import mediaServices from "../media/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

const clearAll = async (serviceConfig: ServiceConfig) => {
	const mediaStrategy = mediaServices.checks.checkHasMediaStrategy({
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
		mediaStrategy.deleteMultiple(allProcessedImages.map((i) => i.key)),
		ProcessedImagesRepo.deleteMultiple({
			where: [],
		}),
	]);
};

export default clearAll;
