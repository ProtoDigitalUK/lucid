import T from "../translations/index.js";
import constants from "../constants.js";
import type { ServiceFn } from "@lucidcms/core/types";

export type DescendantFieldsResponse = {
	collection_document_id: number;
	fields: {
		key: string;
		collection_document_id: number;
		locale_code: string;
		text_value: string | null;
		document_id: number | null;
	}[];
};

/**
 *  Update the fullSlug fields with the computed value
 */
const updateFullSlugFields: ServiceFn<
	[
		{
			docFullSlugs: Array<{
				documentId: number;
				fullSlugs: Record<string, string | null>;
			}>;
		},
	],
	undefined
> = async (context, data) => {
	try {
		const updateFullSlugsPromises = [];
		for (const doc of data.docFullSlugs) {
			for (const [locale, fullSlug] of Object.entries(doc.fullSlugs)) {
				updateFullSlugsPromises.push(
					context.db
						.updateTable("lucid_collection_document_fields")
						.set({ text_value: fullSlug })
						.where("collection_document_id", "=", doc.documentId)
						.where("locale_code", "=", locale)
						.where("key", "=", constants.fields.fullSlug.key)
						.execute(),
				);
			}
		}
		await Promise.all(updateFullSlugsPromises);

		return {
			error: undefined,
			data: undefined,
		};
	} catch (error) {
		return {
			error: {
				type: "basic",
				status: 500,
				message: T(
					"an_unknown_error_occurred_updating_fullslug_fields",
				),
			},
			data: undefined,
		};
	}
};

export default updateFullSlugFields;
