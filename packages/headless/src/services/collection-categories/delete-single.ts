import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import translationsServices from "../translations/index.js";

export interface ServiceData {
	id: number;
}

const deleteSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const deleteCategory = await serviceConfig.config.db.client
		.deleteFrom("headless_collection_categories")
		.where("id", "=", data.id)
		.returning([
			"id",
			"title_translation_key_id",
			"description_translation_key_id",
		])
		.executeTakeFirst();

	if (deleteCategory === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_deleted_name", {
				name: T("category"),
			}),
			message: T("deletion_error_message", {
				name: T("category").toLowerCase(),
			}),
			status: 500,
		});
	}

	await serviceWrapper(translationsServices.deleteMultiple, false)(
		serviceConfig,
		{
			ids: [
				deleteCategory.title_translation_key_id,
				deleteCategory.description_translation_key_id,
			],
		},
	);
};

export default deleteSingle;
