import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import translationsServices from "../translations/index.js";

export interface ServiceData {
	id: number;
}

const deleteSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const deletePage = await serviceConfig.db
		.deleteFrom("headless_collection_multiple_page")
		.where("id", "=", data.id)
		.returning(["title_translation_key_id", "excerpt_translation_key_id"])
		.executeTakeFirst();

	if (deletePage === undefined) {
		throw new APIError({
			type: "basic",
			name: T("dynamic_error_name", {
				name: T("page"),
			}),
			message: T("deletion_error_message", {
				name: T("page").toLowerCase(),
			}),
			status: 500,
		});
	}

	await serviceWrapper(translationsServices.deleteMultiple, false)(
		serviceConfig,
		{
			ids: [
				deletePage.title_translation_key_id,
				deletePage.excerpt_translation_key_id,
			],
		},
	);
};

export default deleteSingle;
