import T from "../../../translations/index.js";
import { LucidAPIError } from "../../../utils/error-handler.js";
import type { MultipartFile } from "@fastify/multipart";
import serviceWrapper from "../../../utils/service-wrapper.js";
import mediaHelpers from "../../../utils/media-helpers.js";
import mediaServices from "../index.js";
import optionsServices from "../../options/index.js";
import type { ServiceConfig } from "../../../utils/service-wrapper.js";

export interface ServiceData {
	fileData: MultipartFile | undefined;
}

const uploadObject = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	let tempFilePath = undefined;

	try {
		if (data.fileData === undefined) {
			throw new LucidAPIError({
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
			});
		}

		const mediaStrategy = mediaServices.checks.checkHasMediaStrategy({
			config: serviceConfig.config,
		});

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
		const proposedSize = await serviceWrapper(
			mediaServices.checks.checkCanStoreMedia,
			false,
		)(serviceConfig, {
			filename: data.fileData.filename,
			size: metaData.size,
		});

		// Save file to storage
		const saveObjectRes = await mediaStrategy.uploadSingle({
			key: metaData.key,
			data: mediaHelpers.streamTempFile(tempFilePath),
			meta: metaData,
		});

		if (saveObjectRes.success === false) {
			throw new LucidAPIError({
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
			});
		}

		metaData.etag = saveObjectRes.response?.etag;

		// Update storage usage stats
		await serviceWrapper(optionsServices.updateSingle, false)(
			serviceConfig,
			{
				name: "media_storage_used",
				valueInt: proposedSize,
			},
		);

		return metaData;
	} finally {
		mediaHelpers.deleteTempFile(tempFilePath);
	}
};

export default uploadObject;
