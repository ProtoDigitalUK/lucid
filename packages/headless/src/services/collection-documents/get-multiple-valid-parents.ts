import type z from "zod";
import { sql } from "kysely";
import type collectionDocumentsSchema from "../../schemas/collection-documents.js";
import collectionDocumentsServices from "../../services/collection-documents/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";

export interface ServiceData {
	collection_key: string;
	query: z.infer<typeof collectionDocumentsSchema.getMultiple.query>;
	document_id: number;
	language_id: number;
}

const getMultipleValidParents = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const page = await serviceConfig.config.db.client
		.selectFrom("headless_collection_documents")
		.select("homepage")
		.where("id", "=", data.document_id)
		.executeTakeFirst();

	if (page === undefined || page.homepage === true) {
		return {
			data: [],
			count: 0,
		};
	}

	const validParents = await sql
		.raw<{
			id: number;
		}>(`WITH RECURSIVE descendants AS (
        SELECT id, parent_id
        FROM headless_collection_documents
        WHERE id = ${data.document_id}

        UNION ALL

        SELECT p.id, p.parent_id
        FROM headless_collection_documents p
        INNER JOIN descendants d ON p.parent_id = d.id
    )
    SELECT p.id
    FROM headless_collection_documents p
    WHERE NOT p.id = ${data.document_id}
    AND p.collection_key = '${data.collection_key}'
    AND NOT p.id IN (SELECT id FROM descendants)
    AND NOT p.homepage
    AND NOT p.is_deleted
    AND p.slug IS NOT NULL;`)
		.execute(serviceConfig.config.db.client);

	if (validParents.rows.length === 0) {
		return {
			data: [],
			count: 0,
		};
	}

	const validParentIds = validParents.rows
		.map((row) => row.id)
		.filter((id) => id !== data.document_id);

	return await serviceWrapper(collectionDocumentsServices.getMultiple, false)(
		serviceConfig,
		{
			query: data.query,
			in_ids: validParentIds,
			language_id: data.language_id,
			collection_key: data.collection_key,
		},
	);
};

export default getMultipleValidParents;
