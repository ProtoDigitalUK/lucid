import T from "../../../translations/index.js";
import slug from "slug";
import { APIError, modelErrors } from "../../../utils/app/error-handler.js";

export interface ServiceData {
	slug?: string | null;
	exclude_key?: string;
}

const checkSlugExists = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.slug === undefined) return undefined;
	if (data.slug === null) return null;

	const slugValue = slug(data.slug, {
		lower: true,
	});

	let slugExistsQuery = serviceConfig.db
		.selectFrom("headless_collections")
		.select("key")
		.where("slug", "=", slugValue);

	if (data.exclude_key !== undefined) {
		slugExistsQuery = slugExistsQuery.where("key", "!=", data.exclude_key);
	}

	const slugExists = await slugExistsQuery.executeTakeFirst();

	if (slugExists !== undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_created_name", {
				name: T("collection"),
			}),
			message: T("error_not_created_message", {
				name: T("collection"),
			}),
			status: 400,
			errors: modelErrors({
				slug: {
					code: "invalid",
					message: T("duplicate_entry_error_message"),
				},
			}),
		});
	}

	return slugValue;
};

export default checkSlugExists;
