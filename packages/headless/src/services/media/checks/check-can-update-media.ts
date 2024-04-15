import T from "../../../translations/index.js";
import { HeadlessAPIError } from "../../../utils/error-handler.js";
import serviceWrapper from "../../../utils/service-wrapper.js";
import optionsServices from "../../options/index.js";

export interface ServiceData {
	size: number;
	previousSize: number;
	filename: string;
}

const checkCanUpdateMedia = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const maxFileSize = serviceConfig.config.media?.maxSize;
	const storageLimit = serviceConfig.config.media?.storage;

	if (data.size > maxFileSize) {
		throw new HeadlessAPIError({
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

	const proposedSize =
		(storageUsed.valueInt || 0) + data.size - data.previousSize;
	if (proposedSize > storageLimit) {
		throw new HeadlessAPIError({
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

export default checkCanUpdateMedia;
