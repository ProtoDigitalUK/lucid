import T from "../../translations/index.js";
import constants from "../../constants.js";
import type {
	ServiceFn,
	FieldSchemaType,
	FieldErrors,
	ServiceResponse,
} from "@lucidcms/core/types";
import type { CollectionConfig } from "../../types/index.js";

/**
 *  If slug is / and parentPage is set (would cause fullSlug to be the same as parentPage just with trailing slash)
 */
const checkRootSlugWithParent = (data: {
	collection: CollectionConfig;
	defaultLocale: string;
	fields: {
		slug: FieldSchemaType;
		parentPage: FieldSchemaType;
	};
}): Awaited<ServiceResponse<undefined>> => {
	if (data.collection.enableTranslations && data.fields.slug.translations) {
		const fieldErrors: FieldErrors[] = [];
		for (const [key, value] of Object.entries(data.fields.slug.translations)) {
			if (value === "/" && data.fields.parentPage.value) {
				fieldErrors.push({
					brickId: constants.collectionFieldBrickId,
					groupId: undefined,
					key: constants.fields.slug.key,
					localeCode: key,
					message: T("slug_cannot_be_slash_and_parent_page_set_message"),
				});
			}
		}
		if (fieldErrors.length > 0) {
			return {
				error: {
					type: "basic",
					status: 400,
					message: T("slug_cannot_be_slash_and_parent_page_set_message"),
					errorResponse: {
						body: {
							fields: fieldErrors,
						},
					},
				},
				data: undefined,
			};
		}
	} else if (data.fields.slug.value === "/" && data.fields.parentPage.value) {
		return {
			error: {
				type: "basic",
				status: 400,
				message: T("slug_cannot_be_slash_and_parent_page_set_message"),
				errorResponse: {
					body: {
						fields: [
							{
								brickId: constants.collectionFieldBrickId,
								groupId: undefined,
								key: constants.fields.parentPage.key,
								localeCode: data.defaultLocale,
								message: T("slug_cannot_be_slash_and_parent_page_set_message"),
							},
						],
					},
				},
			},
			data: undefined,
		};
	}

	return {
		error: undefined,
		data: undefined,
	};
};

export default checkRootSlugWithParent;
