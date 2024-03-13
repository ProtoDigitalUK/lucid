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
}

const checkSlugIsUnique = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.homepage) return "/";
	if (data.slug === undefined) return undefined;
	const slugValue = slug(data.slug, { lower: true });

	const slugExists = await serviceConfig.db
		.selectFrom("headless_collection_multiple_page")
		.where("collection_key", "=", data.collection_key)
		.where("slug", "=", slugValue)
		.executeTakeFirst();

	if (slugExists !== undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_created_name", {
				name: T("page"),
			}),
			message: T("error_not_created_message", {
				name: T("page"),
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
