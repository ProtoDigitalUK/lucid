import T from "../../../translations/index.js";
import { APIError, modelErrors } from "../../../utils/app/error-handler.js";
import getConfig from "../../config.js";
import serviceWrapper from "../../../utils/app/service-wrapper.js";
import optionsServices from "../../options/index.js";

export interface ServiceData {
	size: number;
	filename: string;
}

const checkCanStoreMedia = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const config = await getConfig();

	const maxFileSize = config.media?.maxFileSize || 0;
	const storageLimit = config.media?.storageLimit || 0;

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

	const proposedSize = (storageUsed.value_int || 0) + data.size;
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
};

export default checkCanStoreMedia;
