import T from "../../../translations/index.js";
import type { MultipartFile } from "@fastify/multipart";
import mediaHelpers from "../../../utils/media-helpers.js";
import LucidServices from "../../index.js";
import type { ServiceFn } from "../../../libs/services/types.js";
import type { RouteMediaMetaData } from "../../../utils/media-helpers.js";

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
			await LucidServices.media.checks.checkHasMediaStrategy(service);
		if (mediaStrategyRes.error) return mediaStrategyRes;

		// Save file to temp folder
		tempFilePath = await mediaHelpers.saveStreamToTempFile(
			data.fileData.file,
			data.fileData.filename,
		);
		// Get meta data from file
		const metaData = await mediaHelpers.getMetaData({
			filePath: tempFilePath,
			mimeType: data.fileData.mimetype,
			fileName: data.fileData.filename,
		});

		// Ensure we available storage space
		const proposedSizeRes =
			await LucidServices.media.checks.checkCanUpdateMedia(service, {
				filename: data.fileData.filename,
				size: metaData.size,
				previousSize: data.previousSize,
			});
		if (proposedSizeRes.error) return proposedSizeRes;

		// Save file to storage
		const updateObjectRes = await mediaStrategyRes.data.updateSingle(
			data.key,
			{
				key: metaData.key,
				data: mediaHelpers.streamTempFile(tempFilePath),
				meta: metaData,
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
			LucidServices.option.updateSingle(service, {
				name: "media_storage_used",
				valueInt: proposedSizeRes.data.proposedSize,
			}),
			LucidServices.processedImage.clearSingle(service, {
				key: data.key,
			}),
		]);
		if (storageRes.error) return storageRes;
		if (clearProcessRes.error) return clearProcessRes;

		metaData.etag = updateObjectRes.response?.etag;

		return {
			error: undefined,
			data: metaData,
		};
	} finally {
		mediaHelpers.deleteTempFile(tempFilePath);
	}
};

export default updateObject;
