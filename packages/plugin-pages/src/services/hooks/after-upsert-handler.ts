import { getDescendantFields } from "../index.js";
import type { LucidHookCollection } from "@lucidcms/core/types";

/*
    Find all documents that have this as their parent page - and then the documents that have those as their parent pages (recursively)
    For each document, work out the fullSlug based on the fullSlug of the parent page
    Update the document with the fullSlug
    This needs to be done for all translations of the field if translations are enabled
*/

const afterUpsertHandler: LucidHookCollection<"afterUpsert">["handler"] =
	async (context, data) => {
		const descendantsRes = await getDescendantFields(context, {
			documentId: data.data.documentId,
		});
		if (descendantsRes.error) return descendantsRes;

		// exit early - nothing to do
		if (descendantsRes.data.length === 0) {
			return {
				error: undefined,
				data: undefined,
			};
		}

		for (const descendant of descendantsRes.data) {
			console.log("descendant", descendant);
		}

		return {
			error: undefined,
			data: undefined,
		};
	};

export default afterUpsertHandler;
