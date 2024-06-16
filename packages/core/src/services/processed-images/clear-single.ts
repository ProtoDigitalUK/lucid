import Repository from "../../libs/repositories/index.js";
import mediaServices from "../media/index.js";
import optionsServices from "../options/index.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import type { ServiceFn } from "../../libs/services/types.js";

const clearSingle: ServiceFn<
	[
		{
			key: string;
		},
	],
	undefined
> = async (serviceConfig, data) => {
	const mediaStrategyRes = await serviceWrapper(
		mediaServices.checks.checkHasMediaStrategy,
		{
			transaction: false,
		},
	)(serviceConfig);
	if (mediaStrategyRes.error) return mediaStrategyRes;

	const ProcessedImagesRepo = Repository.get(
		"processed-images",
		serviceConfig.db,
	);

	const [storageUsedRes, processedImages] = await Promise.all([
		serviceWrapper(optionsServices.getSingle, {
			transaction: false,
		})(serviceConfig, {
			name: "media_storage_used",
		}),
		ProcessedImagesRepo.selectMultiple({
			select: ["key", "file_size"],
			where: [
				{
					key: "media_key",
					operator: "=",
					value: data.key,
				},
			],
		}),
	]);
	if (storageUsedRes.error) return storageUsedRes;

	if (processedImages.length === 0) {
		return {
			error: undefined,
			data: undefined,
		};
	}

	const totalSize = processedImages.reduce((acc, i) => acc + i.file_size, 0);

	const newStorageUsed = (storageUsedRes.data.valueInt || 0) - totalSize;

	const [_, __, updateStorageRes] = await Promise.all([
		mediaStrategyRes.data.deleteMultiple(processedImages.map((i) => i.key)),
		ProcessedImagesRepo.deleteMultiple({
			where: [
				{
					key: "media_key",
					operator: "=",
					value: data.key,
				},
			],
		}),
		serviceWrapper(optionsServices.updateSingle, {
			transaction: false,
		})(serviceConfig, {
			name: "media_storage_used",
			valueInt: newStorageUsed < 0 ? 0 : newStorageUsed,
		}),
	]);
	if (updateStorageRes.error) return updateStorageRes;

	return {
		error: undefined,
		data: undefined,
	};
};

export default clearSingle;
