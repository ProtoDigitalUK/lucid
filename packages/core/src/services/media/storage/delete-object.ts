import lucidServices from "../../index.js";
import type { ServiceFn } from "../../../utils/services/types.js";

const deleteObject: ServiceFn<
	[
		{
			key: string;
			size: number;
			processedSize: number;
		},
	],
	undefined
> = async (service, data) => {
	const mediaStrategyRes =
		await lucidServices.media.checks.checkHasMediaStrategy(service);
	if (mediaStrategyRes.error) return mediaStrategyRes;

	const storageUsedRes = await lucidServices.option.getSingle(service, {
		name: "media_storage_used",
	});
	if (storageUsedRes.error) return storageUsedRes;

	const newStorageUsed =
		(storageUsedRes.data.valueInt || 0) - data.size - data.processedSize;

	const [_, updateStorageRes] = await Promise.all([
		mediaStrategyRes.data.deleteSingle(data.key),
		lucidServices.option.updateSingle(service, {
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
