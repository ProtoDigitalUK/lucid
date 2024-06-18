import T from "../../../translations/index.js";
import lucidServices from "../../index.js";
import type { ServiceFn } from "../../../libs/services/types.js";

const checkCanUpdateMedia: ServiceFn<
	[
		{
			size: number;
			previousSize: number;
		},
	],
	{
		proposedSize: number;
	}
> = async (service, data) => {
	const maxFileSize = service.config.media?.maxSize;
	const storageLimit = service.config.media?.storage;

	if (data.size > maxFileSize) {
		return {
			error: {
				type: "basic",
				message: T("file_too_large_max_size_is", {
					size: maxFileSize,
				}),
				status: 500,
				errorResponse: {
					body: {
						file: {
							code: "storage",
							message: T("file_too_large_max_size_is", {
								size: maxFileSize,
							}),
						},
					},
				},
			},
			data: undefined,
		};
	}

	const storageUsedRes = await lucidServices.option.getSingle(service, {
		name: "media_storage_used",
	});
	if (storageUsedRes.error) return storageUsedRes;

	const proposedSize =
		(storageUsedRes.data.valueInt || 0) + data.size - data.previousSize;
	if (proposedSize > storageLimit) {
		return {
			error: {
				type: "basic",
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
