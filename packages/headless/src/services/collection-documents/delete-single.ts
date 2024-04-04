import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";

export interface ServiceData {
	id: number;
	user_id?: number;
}

const deleteSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const deletePage = await serviceConfig.db
		.updateTable("headless_collection_documents")
		.set({
			is_deleted: 1,
			is_deleted_at: new Date().toISOString(),
			deleted_by: data.user_id,
		})
		.where("id", "=", data.id)
		.returning("id")
		.executeTakeFirst();

	if (deletePage === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_deleted_name", {
				name: T("document"),
			}),
			message: T("deletion_error_message", {
				name: T("document").toLowerCase(),
			}),
			status: 500,
		});
	}
};

export default deleteSingle;
