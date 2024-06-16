import optionsServices from "../../options/index.js";
import mediaServices from "../index.js";
import serviceWrapper from "../../../libs/services/service-wrapper.js";
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
	const mediaStrategyRes = await serviceWrapper(
		mediaServices.checks.checkHasMediaStrategy,
		{
			transaction: false,
		},
	)(serviceConfig);
	if (mediaStrategyRes.error) return mediaStrategyRes;

	const storageUsedRes = await serviceWrapper(optionsServices.getSingle, {
		transaction: false,
	})(serviceConfig, {
		name: "media_storage_used",
	});
	if (storageUsedRes.error) return storageUsedRes;

	const newStorageUsed =
		(storageUsedRes.data.valueInt || 0) - data.size - data.processedSize;

	const [_, updateStorageRes] = await Promise.all([
		mediaStrategyRes.data.deleteSingle(data.key),
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

export default deleteObject;
