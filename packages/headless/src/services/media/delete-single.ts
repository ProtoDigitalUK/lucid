import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import mediaServices from "./index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import processedImagesServices from "../processed-images/index.js";
import translationsServices from "../translations/index.js";

export interface ServiceData {
	id: number;
}

const deleteSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const deleteMedia = await serviceConfig.db
		.deleteFrom("headless_media")
		.where("id", "=", data.id)
		.returning([
			"file_size",
			"id",
			"key",
			"title_translation_key_id",
			"alt_translation_key_id",
		])
		.executeTakeFirst();

	if (deleteMedia === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_deleted_name", {
				name: T("media"),
			}),
			message: T("deletion_error_message", {
				name: T("media").toLowerCase(),
			}),
			status: 500,
		});
	}

	await Promise.all([
		serviceWrapper(processedImagesServices.clearSingle, false)(
			serviceConfig,
			{
				key: deleteMedia.key,
			},
		),
		serviceWrapper(mediaServices.storage.deleteObject, false)(
			serviceConfig,
			{
				key: deleteMedia.key,
				size: deleteMedia.file_size,
			},
		),
		serviceWrapper(translationsServices.deleteMultiple, false)(
			serviceConfig,
			{
				ids: [
					deleteMedia.title_translation_key_id,
					deleteMedia.alt_translation_key_id,
				],
			},
		),
	]);
};

export default deleteSingle;
