import Repository from "../../libs/repositories/index.js";
import mediaServices from "../media/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import optionsServices from "../options/index.js";

const clearAll = async (serviceConfig: ServiceConfig) => {
	const mediaStrategy = mediaServices.checks.checkHasMediaStrategy({
		config: serviceConfig.config,
	});

	const ProcessedImagesRepo = Repository.get(
		"processed-images",
		serviceConfig.db,
	);

	const [storageUsed, processedImages] = await Promise.all([
		serviceWrapper(optionsServices.getSingle, false)(serviceConfig, {
			name: "media_storage_used",
		}),
		ProcessedImagesRepo.selectMultiple({
			select: ["key", "file_size"],
			where: [],
		}),
	]);

	if (processedImages.length === 0) return;

	const totalSize = processedImages.reduce((acc, i) => acc + i.file_size, 0);
	const newStorageUsed = (storageUsed.valueInt || 0) - totalSize;

	await Promise.all([
		mediaStrategy.deleteMultiple(processedImages.map((i) => i.key)),
		ProcessedImagesRepo.deleteMultiple({
			where: [],
		}),
		serviceWrapper(optionsServices.updateSingle, false)(serviceConfig, {
			name: "media_storage_used",
			valueInt: newStorageUsed < 0 ? 0 : newStorageUsed,
		}),
	]);
};

export default clearAll;
