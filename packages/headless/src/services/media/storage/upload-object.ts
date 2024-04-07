import T from "../../../translations/index.js";
import { APIError, modelErrors } from "../../../utils/error-handler.js";
import type { MultipartFile } from "@fastify/multipart";
import serviceWrapper from "../../../utils/service-wrapper.js";
import mediaHelpers from "../../../utils/media-helpers.js";
import mediaServices from "../index.js";
import optionsServices from "../../options/index.js";

export interface ServiceData {
	file_data: MultipartFile | undefined;
}

const uploadObject = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	let tempFilePath = undefined;

	try {
		if (data.file_data === undefined) {
			throw new APIError({
				type: "basic",
				name: T("error_not_created_name", {
					name: T("media"),
				}),
				message: T("error_not_created_message", {
					name: T("media"),
				}),
				status: 400,
				errors: modelErrors({
					file: {
						code: "required",
						message: T("ensure_file_has_been_uploaded"),
					},
				}),
			});
		}

		const mediaStategy = mediaServices.checks.checkHasMediaStrategy({
			config: serviceConfig.config,
		});

		// Save file to temp folder
		tempFilePath = await mediaHelpers.saveStreamToTempFile(
			data.file_data.file,
			data.file_data.filename,
		);
		// Get meta data from file
		const metaData = await mediaHelpers.getMetaData({
			filePath: tempFilePath,
			mimeType: data.file_data.mimetype,
			fileName: data.file_data.filename,
		});

		// Ensure we available storage space
		const proposedSize = await serviceWrapper(
			mediaServices.checks.checkCanStoreMedia,
			false,
		)(serviceConfig, {
			filename: data.file_data.filename,
			size: metaData.size,
		});

		// Save file to storage
		const saveObjectRes = await mediaStategy.uploadSingle({
			key: metaData.key,
			data: mediaHelpers.streamTempFile(tempFilePath),
			meta: metaData,
		});

		if (saveObjectRes.success === false) {
			throw new APIError({
				type: "basic",
				name: T("error_not_created_name", {
					name: T("media"),
				}),
				message: saveObjectRes.message,
				status: 500,
				errors: modelErrors({
					file: {
						code: "s3_error",
						message: saveObjectRes.message,
					},
				}),
			});
		}

		metaData.etag = saveObjectRes.response?.etag;

		// Update storage usage stats
		await serviceWrapper(optionsServices.updateSingle, false)(
			serviceConfig,
			{
				name: "media_storage_used",
				value_int: proposedSize,
			},
		);

		return metaData;
	} finally {
		mediaHelpers.deleteTempFile(tempFilePath);
	}
};

export default uploadObject;
