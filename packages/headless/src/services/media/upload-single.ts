import T from "../../translations/index.js";
import { APIError, modelErrors } from "../../utils/app/error-handler.js";
import { MultipartFile } from "@fastify/multipart";
import languagesServices from "../languages/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import mediaHelpers from "../../utils/media/helpers.js";

export interface ServiceData {
	fileData: MultipartFile | undefined;
	translations?: Array<{
		language_id: number;
		title?: string;
		alt?: string;
	}>;
}

const uploadSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.fileData === undefined) {
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

	// Check translation languages exist
	const languagesExist = await serviceWrapper(
		languagesServices.checks.checkLanguagesExist,
		false,
	)(serviceConfig, {
		languageIds: data.translations?.map((t) => t.language_id) || [],
	});

	if (!languagesExist) {
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
				translations: {
					code: "invalid",
					message: T("make_sure_all_translations_languages_exist"),
				},
			}),
		});
	}

	// Save file to temp folder
	const tempFilePath = await mediaHelpers.saveStreamToTempFile(
		data.fileData.file,
		data.fileData.filename,
	);
	// Get meta data from file
	const metaData = await mediaHelpers.getMetaData({
		filePath: tempFilePath,
		mimeType: data.fileData.mimetype,
		fileName: data.fileData.filename,
	});

	console.log(metaData);

	// Ensure we available storage space

	// Save file to storage

	// Create new media record
	// Update storage usage stats

	// Return media id
};

export default uploadSingle;
