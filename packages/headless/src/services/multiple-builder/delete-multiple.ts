import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";

export interface ServiceData {
	ids: number[];
	user_id?: number;
}

const deleteMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.ids.length === 0) return;

	const deletePages = await serviceConfig.db
		.updateTable("headless_collection_multiple_builder")
		.set({
			is_deleted: true,
			is_deleted_at: new Date(),
			slug: null,
			full_slug: null,
			deleted_by: data.user_id,
		})
		.where("id", "in", data.ids)
		.returning("id")
		.execute();

	if (deletePages.length === 0) {
		throw new APIError({
			type: "basic",
			name: T("error_not_deleted_name", {
				name: T("page"),
			}),
			message: T("deletion_error_message", {
				name: T("page").toLowerCase(),
			}),
			status: 500,
		});
	}
};

export default deleteMultiple;
