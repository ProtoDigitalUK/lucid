import serviceWrapper from "../../../utils/service-wrapper.js";
import optionsServices from "../../options/index.js";
import mediaServices from "../index.js";
import type { ServiceConfig } from "../../../utils/service-wrapper.js";

export interface ServiceData {
	key: string;
	size: number;
	processedSize: number;
}

const deleteObject = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	const mediaStrategy = mediaServices.checks.checkHasMediaStrategy({
		config: serviceConfig.config,
	});

	const storageUsed = await serviceWrapper(optionsServices.getSingle, false)(
		serviceConfig,
		{
			name: "media_storage_used",
		},
	);

	const newStorageUsed =
		(storageUsed.valueInt || 0) - data.size - data.processedSize;

	await Promise.all([
		mediaStrategy.deleteSingle(data.key),
		serviceWrapper(optionsServices.updateSingle, false)(serviceConfig, {
			name: "media_storage_used",
			valueInt: newStorageUsed < 0 ? 0 : newStorageUsed,
		}),
	]);
};

export default deleteObject;
