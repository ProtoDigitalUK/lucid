import T from "../../../translations/index.js";
import type { MultipartFile } from "@fastify/multipart";
import mediaHelpers from "../../../utils/media-helpers.js";
import mediaServices from "../index.js";
import optionsServices from "../../options/index.js";
import type { ServiceFn } from "../../../libs/services/types.js";
import type { RouteMediaMetaData } from "../../../utils/media-helpers.js";

const uploadObject: ServiceFn<
	[
		{
			fileData: MultipartFile | undefined;
		},
	],
	RouteMediaMetaData
> = async (serviceConfig, data) => {
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
			await mediaServices.checks.checkHasMediaStrategy(serviceConfig);
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
		const proposedSizeRes = await mediaServices.checks.checkCanStoreMedia(
			serviceConfig,
			{
				filename: data.fileData.filename,
				size: metaData.size,
			},
		);
		if (proposedSizeRes.error) return proposedSizeRes;

		// Save file to storage
		const saveObjectRes = await mediaStrategyRes.data.uploadSingle({
			key: metaData.key,
			data: mediaHelpers.streamTempFile(tempFilePath),
			meta: metaData,
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

		metaData.etag = saveObjectRes.response?.etag;

		// Update storage usage stats
		const updateStorageRes = await optionsServices.updateSingle(
			serviceConfig,
			{
				name: "media_storage_used",
				valueInt: proposedSizeRes.data.proposedSize,
			},
		);
		if (updateStorageRes.error) return updateStorageRes;

		return {
			error: undefined,
			data: metaData,
		};
	} finally {
		mediaHelpers.deleteTempFile(tempFilePath);
	}
};

export default uploadObject;
