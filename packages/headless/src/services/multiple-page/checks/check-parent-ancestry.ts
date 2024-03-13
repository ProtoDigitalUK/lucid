import T from "../../../translations/index.js";
import { APIError, modelErrors } from "../../../utils/app/error-handler.js";
import { sql } from "kysely";

export interface ServiceData {
	page_id: number;
	parent_id?: number | null;
}

const checkParentAncestry = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.parent_id === undefined || data.parent_id === null) return;

	const page = await sql
		.raw<{
			id: number;
		}>(`WITH RECURSIVE ancestry AS (
        SELECT id, parent_id
        FROM headless_collection_multiple_page
        WHERE id = ${data.parent_id}
  
        UNION ALL
  
        SELECT p.id, p.parent_id
        FROM headless_collection_multiple_page p
        JOIN ancestry a ON p.id = a.parent_id
      )
      SELECT id
      FROM ancestry
      WHERE id = ${data.page_id}`)
		.execute(serviceConfig.db);

	if (page.rows.length > 0) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("page"),
			}),
			message: T("error_not_found_message", {
				name: T("page"),
			}),
			status: 400,
			errors: modelErrors({
				parent_id: {
					code: "invalid",
					message: T("parent_is_child_of_page"),
				},
			}),
		});
	}
};

export default checkParentAncestry;
