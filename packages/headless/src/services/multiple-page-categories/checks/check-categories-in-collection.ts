import T from "../../../translations/index.js";
import { APIError, modelErrors } from "../../../utils/app/error-handler.js";

export interface ServiceData {
	category_ids: Array<number>;
	collection_key: string;
}

const checkCategoriesInCollection = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.category_ids.length === 0) return;

	const categories = await serviceConfig.db
		.selectFrom("headless_collection_categories")
		.select(["id"])
		.where("collection_key", "=", data.collection_key)
		.where("id", "in", data.category_ids)
		.execute();

	if (categories.length !== data.category_ids.length) {
		throw new APIError({
			type: "basic",
			name: T("error_not_created_name", {
				name: T("page"),
			}),
			message: T("error_not_created_message", {
				name: T("page"),
			}),
			status: 400,
			errors: modelErrors({
				category_ids: {
					code: "invalid",
					message: T("error_not_found_message", {
						name: T("category"),
					}),
				},
			}),
		});
	}
};

export default checkCategoriesInCollection;