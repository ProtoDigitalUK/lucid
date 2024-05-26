import serviceWrapper from "../../../utils/service-wrapper.js";
import optionsServices from "../../options/index.js";
import type { ServiceConfig } from "../../../utils/service-wrapper.js";

export interface ServiceData {
	size: number;
}

const checkCanStore = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
): Promise<{
	success: boolean;
	proposedSize: number;
}> => {
	const maxFileSize = serviceConfig.config.media.maxSize;
	const storageLimit = serviceConfig.config.media.storage;

	if (data.size > maxFileSize) {
		return {
			success: false,
			proposedSize: 0,
		};
	}

	const storageUsed = await serviceWrapper(optionsServices.getSingle, false)(
		serviceConfig,
		{
			name: "media_storage_used",
		},
	);

	const proposedSize = (storageUsed.valueInt || 0) + data.size;
	if (proposedSize > storageLimit) {
		return {
			success: false,
			proposedSize: proposedSize,
		};
	}

	return {
		success: true,
		proposedSize: proposedSize,
	};
};

export default checkCanStore;
