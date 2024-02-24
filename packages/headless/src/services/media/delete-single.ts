import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import mediaServices from "./index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import processedImagesServices from "../processed-images/index.js";
import translationsServices from "../translations/index.js";

export interface ServiceData {
	id: number;
}

const deleteSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const deleteEmail = await serviceConfig.db
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

	if (deleteEmail === undefined) {
		throw new APIError({
			type: "basic",
			name: T("dynamic_error_name", {
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
				key: deleteEmail.key,
			},
		),
		serviceWrapper(mediaServices.storage.deleteObject, false)(
			serviceConfig,
			{
				key: deleteEmail.key,
				size: deleteEmail.file_size,
			},
		),
		serviceWrapper(translationsServices.deleteMultiple, false)(
			serviceConfig,
			{
				ids: [
					deleteEmail.title_translation_key_id,
					deleteEmail.alt_translation_key_id,
				],
			},
		),
	]);
};

export default deleteSingle;
