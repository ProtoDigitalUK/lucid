import T from "../../../translations/index.js";
import {
	saveStreamToTempFile,
	getFileMetaData,
	streamTempFile,
	deleteTempFile,
} from "../../../utils/media/index.js";
import type { MultipartFile } from "@fastify/multipart";
import type { ServiceFn } from "../../../utils/services/types.js";
import type { MediaKitMeta } from "../../../libs/media-kit/index.js";

const uploadObject: ServiceFn<
	[
		{
			fileData: MultipartFile | undefined;
		},
	],
	MediaKitMeta
> = async (context, data) => {
	let tempFilePath = undefined;

	try {
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
			await context.services.media.checks.checkHasMediaStrategy(context);
		if (mediaStrategyRes.error) return mediaStrategyRes;

		// Save file to temp folder
		tempFilePath = await saveStreamToTempFile(
			data.fileData.file,
			data.fileData.filename,
		);
		// Get meta data from file
		const metaDataRes = await getFileMetaData({
			filePath: tempFilePath,
			mimeType: data.fileData.mimetype,
			fileName: data.fileData.filename,
		});
		if (metaDataRes.error) return metaDataRes;

		// Ensure we available storage space
		const proposedSizeRes =
			await context.services.media.checks.checkCanStoreMedia(context, {
				size: metaDataRes.data.size,
			});
		if (proposedSizeRes.error) return proposedSizeRes;

		// Save file to storage
		const saveObjectRes = await mediaStrategyRes.data.uploadSingle({
			key: metaDataRes.data.key,
			data: streamTempFile(tempFilePath),
			meta: metaDataRes.data,
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
								code: "s3_error",
								message: saveObjectRes.error.message,
							},
						},
					},
				},
				data: undefined,
			};
		}

		if (saveObjectRes.data?.etag)
			metaDataRes.data.etag = saveObjectRes.data.etag;

		// Update storage usage stats
		const updateStorageRes = await context.services.option.updateSingle(
			context,
			{
				name: "media_storage_used",
				valueInt: proposedSizeRes.data.proposedSize,
			},
		);
		if (updateStorageRes.error) return updateStorageRes;

		return {
			error: undefined,
			data: metaDataRes.data,
		};
	} finally {
		deleteTempFile(tempFilePath);
	}
};

export default uploadObject;
