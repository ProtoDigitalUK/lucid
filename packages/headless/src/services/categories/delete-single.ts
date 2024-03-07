import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";

export interface ServiceData {
	id: number;
}

const deleteSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const deleteCategory = await serviceConfig.db
		.deleteFrom("headless_collection_categories")
		.where("id", "=", data.id)
		.returning(["id"])
		.executeTakeFirst();

	if (deleteCategory === undefined) {
		throw new APIError({
			type: "basic",
			name: T("dynamic_error_name", {
				name: T("category"),
			}),
			message: T("deletion_error_message", {
				name: T("category").toLowerCase(),
			}),
			status: 500,
		});
	}
};

export default deleteSingle;
