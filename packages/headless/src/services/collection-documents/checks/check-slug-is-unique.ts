import T from "../../../translations/index.js";
import { APIError, modelErrors } from "../../../utils/error-handler.js";
import slug from "slug";
import type { ErrorContentT } from "../../../utils/helpers.js";

/*
    Checks:
    - If the slug is unique within its collection
*/

export interface ServiceData {
	collection_key: string;
	slug?: string;
	document_id?: number;
	errorContent: ErrorContentT;
}

const checkSlugIsUnique = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.slug === undefined) return undefined;
	const slugValue = slug(data.slug, { lower: true });

	let slugExistsQuery = serviceConfig.db
		.selectFrom("headless_collection_documents")
		.select("id")
		.where("collection_key", "=", data.collection_key)
		.where("slug", "=", slugValue)
		.where("is_deleted", "=", 0);

	if (data.document_id !== undefined) {
		slugExistsQuery = slugExistsQuery.where("id", "!=", data.document_id);
	}

	const slugExists = await slugExistsQuery.executeTakeFirst();

	if (slugExists !== undefined) {
		throw new APIError({
			type: "basic",
			name: data.errorContent.name,
			message: data.errorContent.message,
			status: 400,
			errors: modelErrors({
				slug: {
					code: "invalid",
					message: T("error_not_unique_message"),
				},
			}),
		});
	}

	return slugValue;
};

export default checkSlugIsUnique;
