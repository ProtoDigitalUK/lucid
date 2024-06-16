import T from "../../../translations/index.js";
import LucidServices from "../../index.js";
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
> = async (service, data) => {
	const maxFileSize = service.config.media.maxSize;
	const storageLimit = service.config.media.storage;

	if (data.size > maxFileSize) {
		return {
			error: undefined,
			data: {
				proposedSize: 0,
			},
		};
	}

	const storageUsed = await LucidServices.option.getSingle(service, {
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
