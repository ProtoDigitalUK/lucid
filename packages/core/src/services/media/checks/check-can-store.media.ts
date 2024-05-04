import T from "../../../translations/index.js";
import { LucidAPIError } from "../../../utils/error-handler.js";
import serviceWrapper from "../../../utils/service-wrapper.js";
import optionsServices from "../../options/index.js";
import type { ServiceConfig } from "../../../utils/service-wrapper.js";

export interface ServiceData {
	size: number;
	filename: string;
}

const checkCanStoreMedia = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	const maxFileSize = serviceConfig.config.media.maxSize;
	const storageLimit = serviceConfig.config.media.storage;

	if (data.size > maxFileSize) {
		throw new LucidAPIError({
			type: "basic",
			name: T("default_error_name"),
			message: T("file_too_large_max_size_is", {
				name: data.filename,
				size: maxFileSize,
			}),
			status: 500,
			errorResponse: {
				body: {
					file: {
						code: "storage",
						message: T("file_too_large_max_size_is", {
							name: data.filename,
							size: maxFileSize,
						}),
					},
				},
			},
		});
	}

	const storageUsed = await serviceWrapper(optionsServices.getSingle, false)(
		serviceConfig,
		{
			name: "media_storage_used",
		},
	);

	const proposedSize = (storageUsed.valueInt || 0) + data.size;
	if (proposedSize > storageLimit) {
		throw new LucidAPIError({
			type: "basic",
			name: T("default_error_name"),
			message: T("file_exceeds_storage_limit_max_limit_is", {
				size: storageLimit,
			}),
			status: 500,
			errorResponse: {
				body: {
					file: {
						code: "storage",
						message: T("file_exceeds_storage_limit_max_limit_is", {
							size: storageLimit,
						}),
					},
				},
			},
		});
	}

	return proposedSize;
};

export default checkCanStoreMedia;
