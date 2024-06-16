import T from "../../../translations/index.js";
import optionsServices from "../../options/index.js";
import type { ServiceFn } from "../../../libs/services/types.js";

const checkCanStore: ServiceFn<
	[
		{
			size: number;
		},
	],
	{
		proposedSize: number;
	}
> = async (serviceConfig, data) => {
	const maxFileSize = serviceConfig.config.media.maxSize;
	const storageLimit = serviceConfig.config.media.storage;

	if (data.size > maxFileSize) {
		return {
			error: undefined,
			data: {
				proposedSize: 0,
			},
		};
	}

	const storageUsed = await optionsServices.getSingle(serviceConfig, {
		name: "media_storage_used",
	});
	if (storageUsed.error) return storageUsed;

	const proposedSize = (storageUsed.data.valueInt || 0) + data.size;
	if (proposedSize > storageLimit) {
		return {
			error: {
				type: "basic",
				message: T("processed_images_size_limit_exceeded"),
			},
			data: undefined,
		};
	}

	return {
		error: undefined,
		data: {
			proposedSize: proposedSize,
		},
	};
};

export default checkCanStore;
