import T from "../../../translations/index.js";
import { HeadlessAPIError } from "../../../utils/error-handler.js";
import Repository from "../../../libs/repositories/index.js";

/*
    Checks:
    - If the collection has multiple set to false, that there is no document created for it yet.
*/

export interface ServiceData {
	collection_key: string;
	collection_mode: "single" | "multiple";
	document_id?: number;
}

const checkSingleCollectionDocumentCount = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.document_id !== undefined) return;
	if (data.collection_mode === "multiple") return;

	const CollectionDocumentsRepo = Repository.get(
		"collection-documents",
		serviceConfig.db,
	);

	const hasDocument = await CollectionDocumentsRepo.selectSingle({
		select: ["id"],
		where: [
			{
				key: "collection_key",
				operator: "=",
				value: data.collection_key,
			},
			{
				key: "is_deleted",
				operator: "=",
				value: 0,
			},
		],
	});

	if (hasDocument !== undefined) {
		throw new HeadlessAPIError({
			type: "basic",
			message: T("this_collection_has_a_document_already"),
			status: 400,
			errorResponse: {
				body: {
					collection_key: {
						code: "invalid",
						message: T("this_collection_has_a_document_already"),
					},
				},
			},
		});
	}
};

export default checkSingleCollectionDocumentCount;
