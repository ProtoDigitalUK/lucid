import T from "../../../translations/index.js";
import MediaKit from "../../../libs/media-kit/index.js";
import type { MultipartFile } from "@fastify/multipart";
import type { ServiceFn } from "../../../utils/services/types.js";
import type { MediaKitMeta } from "../../../libs/media-kit/index.js";

const upload: ServiceFn<
	[
		{
			fileData: MultipartFile | undefined;
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

	// check storage space
	const proposedSizeRes =
		await context.services.media.checks.checkCanStoreMedia(context, {
			size: injectRes.data.size,
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

	const saveObjectRes = await mediaStrategyRes.data.uploadSingle({
		key: injectRes.data.key,
		data: mediaStream,
		meta: injectRes.data,
	});

	if (saveObjectRes.error) {
		return {
			error: {
				type: "basic",
				message: saveObjectRes.error.message,
				status: 500,
				errorResponse: {
					body: {
						file: {
							code: "media_error",
							message: saveObjectRes.error.message,
						},
					},
				},
			},
			data: undefined,
		};
	}
	if (saveObjectRes.data?.etag) injectRes.data.etag = saveObjectRes.data.etag;

	// Update storage usage stats and clean up
	const [updateStorageRes] = await Promise.all([
		context.services.option.updateSingle(context, {
			name: "media_storage_used",
			valueInt: proposedSizeRes.data.proposedSize,
		}),
		media.done(),
	]);
	if (updateStorageRes.error) return updateStorageRes;

	return {
		error: undefined,
		data: injectRes.data,
	};
};

export default upload;
