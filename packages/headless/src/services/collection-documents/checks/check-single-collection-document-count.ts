import T from "../../../translations/index.js";
import { APIError, modelErrors } from "../../../utils/error-handler.js";
import type { ErrorContentT } from "../../../utils/helpers.js";

/*
    Checks:
    - If the collection has multiple set to false, that there is no document created for it yet.
*/

export interface ServiceData {
	collection_key: string;
	collection_multiple: boolean;
	document_id?: number;
	errorContent: ErrorContentT;
}

const checkSingleCollectionDocumentCount = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.document_id !== undefined) return;
	if (data.collection_multiple === true) return;

	const hasDocument = await serviceConfig.db
		.selectFrom("headless_collection_documents")
		.select("id")
		.where("collection_key", "=", data.collection_key)
		.where("is_deleted", "=", false)
		.limit(1)
		.executeTakeFirst();

	if (hasDocument !== undefined) {
		throw new APIError({
			type: "basic",
			name: data.errorContent.name,
			message: data.errorContent.message,
			status: 400,
			errors: modelErrors({
				collection_key: {
					code: "invalid",
					message: T("this_collection_has_a_document_already"),
				},
			}),
		});
	}
};

export default checkSingleCollectionDocumentCount;
