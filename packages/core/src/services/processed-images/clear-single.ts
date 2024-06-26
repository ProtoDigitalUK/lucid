import Repository from "../../libs/repositories/index.js";
import type { ServiceFn } from "../../utils/services/types.js";

const clearSingle: ServiceFn<
	[
		{
			key: string;
		},
	],
	undefined
> = async (context, data) => {
	const mediaStrategyRes =
		await context.services.media.checks.checkHasMediaStrategy(context);
	if (mediaStrategyRes.error) return mediaStrategyRes;

	const ProcessedImagesRepo = Repository.get("processed-images", context.db);

	const [storageUsedRes, processedImages] = await Promise.all([
		context.services.option.getSingle(context, {
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
		context.services.option.updateSingle(context, {
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
