import type { QueryParamFilters } from "../../types/query-params.js";
import type { HeadlessCollectionDocuments } from "../../libs/db/types.js";
import type { DocumentFieldFilters } from "../../types.js";
import type CollectionBuilder from "../../libs/builders/collection-builder/index.js";

const splitDocumentFilters = (
	collection: CollectionBuilder,
	filters?: QueryParamFilters,
): {
	documentFilters: QueryParamFilters;
	documentFieldFilters: DocumentFieldFilters[];
} => {
	if (!filters) return { documentFilters: {}, documentFieldFilters: [] };

	const validDocFilters: Array<keyof HeadlessCollectionDocuments | string> = [
		"id",
		"created_by",
		"updated_by",
		"created_at",
		"updated_at",
		"createdBy",
		"updatedBy",
		"createdAt",
		"updatedAt",
	];

	const documentFilters: QueryParamFilters = {};
	for (const [key, value] of Object.entries(filters)) {
		if (validDocFilters.includes(key)) {
			documentFilters[key] = value;
		}
	}

	return {
		documentFilters: documentFilters,
		documentFieldFilters: collection.documentFieldFilters(filters, true),
	};
};

export default splitDocumentFilters;
