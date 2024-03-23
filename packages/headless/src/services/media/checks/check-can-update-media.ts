import T from "../../../translations/index.js";
import { APIError, modelErrors } from "../../../utils/error-handler.js";
import getConfig from "../../../libs/config/get-config.js";
import serviceWrapper from "../../../utils/service-wrapper.js";
import optionsServices from "../../options/index.js";
import constants from "../../../constants.js";

export interface ServiceData {
	size: number;
	previous_size: number;
	filename: string;
}

const checkCanUpdateMedia = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const config = await getConfig();

	const maxFileSize = config.media.maxFileSize || constants.media.maxFileSize;
	const storageLimit =
		config.media.storageLimit || constants.media.storageLimit;

	if (data.size > maxFileSize) {
		throw new APIError({
			type: "basic",
			name: T("default_error_name"),
			message: T("file_too_large_max_size_is", {
				name: data.filename,
				size: maxFileSize,
			}),
			status: 500,
			errors: modelErrors({
				file: {
					code: "storage_limit",
					message: T("file_too_large_max_size_is", {
						name: data.filename,
						size: maxFileSize,
					}),
				},
			}),
		});
	}

	const storageUsed = await serviceWrapper(optionsServices.getSingle, false)(
		serviceConfig,
		{
			name: "media_storage_used",
		},
	);

	const proposedSize =
		(storageUsed.value_int || 0) + data.size - data.previous_size;
	if (proposedSize > storageLimit) {
		throw new APIError({
			type: "basic",
			name: T("default_error_name"),
			message: T("file_exceeds_storage_limit_max_limit_is", {
				size: storageLimit,
			}),
			status: 500,
			errors: modelErrors({
				file: {
					code: "storage_limit",
					message: T("file_exceeds_storage_limit_max_limit_is", {
						size: storageLimit,
					}),
				},
			}),
		});
	}

	return proposedSize;
};

export default checkCanUpdateMedia;
