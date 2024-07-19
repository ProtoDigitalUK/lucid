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

const updateObject: ServiceFn<
	[
		{
			fileData: MultipartFile | undefined;
			previousSize: number;
			key: string;
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
			await context.services.media.checks.checkCanUpdateMedia(context, {
				size: metaDataRes.data.size,
				previousSize: data.previousSize,
			});
		if (proposedSizeRes.error) return proposedSizeRes;

		// Save file to storage
		const updateObjectRes = await mediaStrategyRes.data.updateSingle(
			data.key,
			{
				key: metaDataRes.data.key,
				data: streamTempFile(tempFilePath),
				meta: metaDataRes.data,
			},
		);
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

		const [storageRes, clearProcessRes] = await Promise.all([
			context.services.option.updateSingle(context, {
				name: "media_storage_used",
				valueInt: proposedSizeRes.data.proposedSize,
			}),
			context.services.processedImage.clearSingle(context, {
				key: data.key,
			}),
		]);
		if (storageRes.error) return storageRes;
		if (clearProcessRes.error) return clearProcessRes;

		if (updateObjectRes.data?.etag)
			metaDataRes.data.etag = updateObjectRes.data.etag;

		return {
			error: undefined,
			data: metaDataRes.data,
		};
	} finally {
		deleteTempFile(tempFilePath);
	}
};

export default updateObject;
