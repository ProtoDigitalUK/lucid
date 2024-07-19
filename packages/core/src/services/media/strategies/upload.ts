import T from "../../../translations/index.js";
import MediaKit from "../../../libs/media-kit/index.js";
import type { MultipartFile } from "@fastify/multipart";
import type { ServiceFn } from "../../../utils/services/types.js";
import type { RouteMediaMetaData } from "../../../types/types.js";

const uploadObject: ServiceFn<
	[
		{
			fileData: MultipartFile | undefined;
		},
	],
	RouteMediaMetaData
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
	const saveObjectRes = await mediaStrategyRes.data.uploadSingle({
		key: injectRes.data.key,
		data: media.streamTempFile(),
		meta: injectRes.data,
	});

	if (saveObjectRes.success === false) {
		return {
			error: {
				type: "basic",
				message: saveObjectRes.message,
				status: 500,
				errorResponse: {
					body: {
						file: {
							code: "s3_error",
							message: saveObjectRes.message,
						},
					},
				},
			},
			data: undefined,
		};
	}
	if (saveObjectRes.response?.etag)
		injectRes.data.etag = saveObjectRes.response.etag;

	// Update storage usage stats
	const updateStorageRes = await context.services.option.updateSingle(
		context,
		{
			name: "media_storage_used",
			valueInt: proposedSizeRes.data.proposedSize,
		},
	);
	if (updateStorageRes.error) return updateStorageRes;

	// clean up
	await media.done();

	return {
		error: undefined,
		data: injectRes.data,
	};
};

export default uploadObject;
