import T from "../../../translations/index.js";
import { LucidAPIError } from "../../../utils/error-handler.js";
import type { MultipartFile } from "@fastify/multipart";
import serviceWrapper from "../../../utils/service-wrapper.js";
import mediaHelpers from "../../../utils/media-helpers.js";
import mediaServices from "../index.js";
import optionsServices from "../../options/index.js";
import processedImagesServices from "../../processed-images/index.js";
import type { ServiceConfig } from "../../../utils/service-wrapper.js";

export interface ServiceData {
	fileData: MultipartFile | undefined;
	previousSize: number;
	key: string;
}

const updateObject = async (
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
			mediaServices.checks.checkCanUpdateMedia,
			false,
		)(serviceConfig, {
			filename: data.fileData.filename,
			size: metaData.size,
			previousSize: data.previousSize,
		});

		// Save file to storage
		const updateObjectRes = await mediaStrategy.updateSingle(data.key, {
			key: metaData.key,
			data: mediaHelpers.streamTempFile(tempFilePath),
			meta: metaData,
		});

		if (updateObjectRes.success === false) {
			throw new LucidAPIError({
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
			});
		}

		const updateStoragePromise = serviceWrapper(
			optionsServices.updateSingle,
			false,
		)(serviceConfig, {
			name: "media_storage_used",
			valueInt: proposedSize,
		});
		const clearProcessedPromise = serviceWrapper(
			processedImagesServices.clearSingle,
			false,
		)(serviceConfig, {
			key: data.key,
		});

		await Promise.all([updateStoragePromise, clearProcessedPromise]);

		metaData.etag = updateObjectRes.response?.etag;

		return metaData;
	} finally {
		mediaHelpers.deleteTempFile(tempFilePath);
	}
};

export default updateObject;
