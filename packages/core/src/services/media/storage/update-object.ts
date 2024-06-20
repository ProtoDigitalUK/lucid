import T from "../../../translations/index.js";
import lucidServices from "../../index.js";
import {
	saveStreamToTempFile,
	getFileMetaData,
	streamTempFile,
	deleteTempFile,
} from "../../../utils/media/index.js";
import type { MultipartFile } from "@fastify/multipart";
import type { ServiceFn } from "../../../utils/services/types.js";
import type { RouteMediaMetaData } from "../../../types/types.js";

const updateObject: ServiceFn<
	[
		{
			fileData: MultipartFile | undefined;
			previousSize: number;
			key: string;
		},
	],
	RouteMediaMetaData
> = async (service, data) => {
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
			await lucidServices.media.checks.checkHasMediaStrategy(service);
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
			await lucidServices.media.checks.checkCanUpdateMedia(service, {
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

		if (updateObjectRes.success === false) {
			return {
				error: {
					type: "basic",
					message: updateObjectRes.message,
					status: 500,
					errorResponse: {
						body: {
							file: {
								code: "s3_error",
								message: updateObjectRes.message,
							},
						},
					},
				},
				data: undefined,
			};
		}

		const [storageRes, clearProcessRes] = await Promise.all([
			lucidServices.option.updateSingle(service, {
				name: "media_storage_used",
				valueInt: proposedSizeRes.data.proposedSize,
			}),
			lucidServices.processedImage.clearSingle(service, {
				key: data.key,
			}),
		]);
		if (storageRes.error) return storageRes;
		if (clearProcessRes.error) return clearProcessRes;

		metaDataRes.data.etag = updateObjectRes.response?.etag;

		return {
			error: undefined,
			data: metaDataRes.data,
		};
	} finally {
		deleteTempFile(tempFilePath);
	}
};

export default updateObject;
