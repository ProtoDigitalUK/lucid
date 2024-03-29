import T from "../../../translations/index.js";
import { APIError, modelErrors } from "../../../utils/error-handler.js";
import { sql } from "kysely";
import type { ErrorContentT } from "../../../utils/helpers.js";

/*
    Checks:
    - If the parent is a child of the document
*/

export interface ServiceData {
	document_id?: number;
	parent_id?: number | null;
	errorContent: ErrorContentT;
}

const checkParentAncestry = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.document_id === undefined) return;
	if (data.parent_id === undefined || data.parent_id === null) return;

	const document = await sql
		.raw<{
			id: number;
		}>(`WITH RECURSIVE ancestry AS (
        SELECT id, parent_id
        FROM headless_collection_documents
        WHERE id = ${data.parent_id}
  
        UNION ALL
  
        SELECT p.id, p.parent_id
        FROM headless_collection_documents p
        JOIN ancestry a ON p.id = a.parent_id
      )
      SELECT id
      FROM ancestry
      WHERE id = ${data.document_id}`)
		.execute(serviceConfig.config.db.client);

	if (document.rows.length > 0) {
		throw new APIError({
			type: "basic",
			name: data.errorContent.name,
			message: data.errorContent.message,
			status: 400,
			errors: modelErrors({
				parent_id: {
					code: "invalid",
					message: T("parent_is_child_of_document"),
				},
			}),
		});
	}
};

export default checkParentAncestry;
