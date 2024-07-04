import type { QueryParamFilters } from "../../types/query-params.js";
import type { HeadlessCollectionDocuments } from "../../libs/db/types.js";
import type { DocumentFieldFilters } from "../../types.js";
import type CollectionBuilder from "../../libs/builders/collection-builder/index.js";

const splitDocumentFilters = (
	collection: CollectionBuilder,
	filters?: QueryParamFilters,
): {
	documentFilters: QueryParamFilters;
	fieldFilters: DocumentFieldFilters[];
} => {
	if (!filters) return { documentFilters: {}, fieldFilters: [] };

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
		// TODO: we may not want to limit this to just fields that have been marked as filterable, instead we could open it up to all fields.
		fieldFilters: collection.documentFieldFilters(filters),
	};
};

export default splitDocumentFilters;
