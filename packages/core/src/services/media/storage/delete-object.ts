import optionsServices from "../../options/index.js";
import mediaServices from "../index.js";
import type { ServiceFn } from "../../../libs/services/types.js";

const deleteObject: ServiceFn<
	[
		{
			key: string;
			size: number;
			processedSize: number;
		},
	],
	undefined
> = async (serviceConfig, data) => {
	const mediaStrategyRes =
		await mediaServices.checks.checkHasMediaStrategy(serviceConfig);
	if (mediaStrategyRes.error) return mediaStrategyRes;

	const storageUsedRes = await optionsServices.getSingle(serviceConfig, {
		name: "media_storage_used",
	});
	if (storageUsedRes.error) return storageUsedRes;

	const newStorageUsed =
		(storageUsedRes.data.valueInt || 0) - data.size - data.processedSize;

	const [_, updateStorageRes] = await Promise.all([
		mediaStrategyRes.data.deleteSingle(data.key),
		optionsServices.updateSingle(serviceConfig, {
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

export default deleteObject;
