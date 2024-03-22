import T from "../../../translations/index.js";
import { APIError, modelErrors } from "../../../utils/app/error-handler.js";
import slug from "slug";

/*
    Checks:
    - If the slug is unique within its collection
*/

export interface ServiceData {
	collection_key: string;
	slug?: string;
	homepage?: boolean;
	page_id?: number;
}

const checkSlugIsUnique = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.homepage) return "/";
	if (data.slug === undefined) return undefined;
	const slugValue = slug(data.slug, { lower: true });

	let slugExistsQuery = serviceConfig.db
		.selectFrom("headless_collection_multiple_builder")
		.where("collection_key", "=", data.collection_key)
		.where("slug", "=", slugValue)
		.where("is_deleted", "=", false);

	if (data.page_id !== undefined) {
		slugExistsQuery = slugExistsQuery.where("id", "!=", data.page_id);
	}

	const slugExists = await slugExistsQuery.executeTakeFirst();

	if (slugExists !== undefined) {
		throw new APIError({
			type: "basic",
			name:
				data.page_id === undefined
					? T("error_not_created_name", {
							name: T("page"),
						})
					: T("error_not_updated_name", {
							name: T("page"),
						}),
			message:
				data.page_id === undefined
					? T("error_not_created_message", {
							name: T("page"),
						})
					: T("update_error_message", {
							name: T("page").toLowerCase(),
						}),
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
