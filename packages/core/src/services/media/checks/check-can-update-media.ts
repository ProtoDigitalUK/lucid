import T from "../../../translations/index.js";
import optionsServices from "../../options/index.js";
import serviceWrapper from "../../../libs/services/service-wrapper.js";
import type { ServiceFn } from "../../../libs/services/types.js";

const checkCanUpdateMedia: ServiceFn<
	[
		{
			size: number;
			previousSize: number;
			filename: string;
		},
	],
	{
		proposedSize: number;
	}
> = async (serviceConfig, data) => {
	const maxFileSize = serviceConfig.config.media?.maxSize;
	const storageLimit = serviceConfig.config.media?.storage;

	if (data.size > maxFileSize) {
		return {
			error: {
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
			},
			data: undefined,
		};
	}

	const storageUsedRes = await serviceWrapper(optionsServices.getSingle, {
		transaction: false,
	})(serviceConfig, {
		name: "media_storage_used",
	});
	if (storageUsedRes.error) return storageUsedRes;

	const proposedSize =
		(storageUsedRes.data.valueInt || 0) + data.size - data.previousSize;
	if (proposedSize > storageLimit) {
		return {
			error: {
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
							message: T(
								"file_exceeds_storage_limit_max_limit_is",
								{
									size: storageLimit,
								},
							),
						},
					},
				},
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

export default checkCanUpdateMedia;
