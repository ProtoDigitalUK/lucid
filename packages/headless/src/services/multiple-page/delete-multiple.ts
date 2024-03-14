import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import translationsServices from "../translations/index.js";

export interface ServiceData {
	ids: number[];
}

const deleteMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.ids.length === 0) return;

	const deletePages = await serviceConfig.db
		.deleteFrom("headless_collection_multiple_page")
		.where("id", "in", data.ids)
		.returning(["title_translation_key_id", "excerpt_translation_key_id"])
		.execute();

	if (deletePages.length === 0) {
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
			ids: deletePages.flatMap((page) => [
				page.title_translation_key_id,
				page.excerpt_translation_key_id,
			]),
		},
	);
};

export default deleteMultiple;
