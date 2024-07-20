import T from "../../../translations/index.js";
import MediaKit from "../../../libs/media-kit/index.js";
import type { MultipartFile } from "@fastify/multipart";
import type { ServiceFn } from "../../../utils/services/types.js";
import type { MediaKitMeta } from "../../../libs/media-kit/index.js";

const update: ServiceFn<
	[
		{
			id: number;
			fileData: MultipartFile | undefined;
			previousSize: number;
			key: string;
		},
	],
	MediaKitMeta
> = async (context, data) => {
	if (data.fileData === undefined) {
		return {
			error: {
				type: "basic",
				status: 400,
				errorResponse: {
					body: {
						file: {
							code: "required",
							message: T("ensure_file_has_been_uploaded"),
						},
					},
				},
			},
			data: undefined,
		};
	}

	const mediaStrategyRes =
		context.services.media.checks.checkHasMediaStrategy(context);
	if (mediaStrategyRes.error) return mediaStrategyRes;

	const media = new MediaKit(context.config.media);

	// sotre and get meta data
	const injectRes = await media.injectFile(data.fileData);
	if (injectRes.error) return injectRes;

	// Ensure we available storage space
	const proposedSizeRes =
		await context.services.media.checks.checkCanUpdateMedia(context, {
			size: injectRes.data.size,
			previousSize: data.previousSize,
		});
	if (proposedSizeRes.error) return proposedSizeRes;

	// Save file to storage
	const mediaStream = media.streamTempFile();
	if (!mediaStream) {
		return {
			error: {
				type: "basic",
				message: T("media_error_getting_metadata"),
				status: 500,
			},
			data: undefined,
		};
	}

	const updateObjectRes = await mediaStrategyRes.data.updateSingle(data.key, {
		key: injectRes.data.key,
		data: mediaStream,
		meta: injectRes.data,
	});
	if (updateObjectRes.error) {
		return {
			error: {
				type: "basic",
				message: updateObjectRes.error.message,
				status: 500,
				errorResponse: {
					body: {
						file: {
							code: "s3_error",
							message: updateObjectRes.error.message,
						},
					},
				},
			},
			data: undefined,
		};
	}
	if (updateObjectRes.data?.etag)
		injectRes.data.etag = updateObjectRes.data.etag;

	// update storage, processed images and delete temp
	const [storageRes, clearProcessRes] = await Promise.all([
		context.services.option.updateSingle(context, {
			name: "media_storage_used",
			valueInt: proposedSizeRes.data.proposedSize,
		}),
		context.services.processedImage.clearSingle(context, {
			id: data.id,
		}),
		media.done(),
	]);
	if (storageRes.error) return storageRes;
	if (clearProcessRes.error) return clearProcessRes;

	return {
		error: undefined,
		data: injectRes.data,
	};
};

export default update;
