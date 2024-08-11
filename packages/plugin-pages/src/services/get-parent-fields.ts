import T from "../translations/index.js";
import constants from "../constants.js";
import type { ServiceFn, FieldSchemaType } from "@lucidcms/core/types";

/**
 *  Get the parent document pages fields
 */
const getParentFields: ServiceFn<
	[
		{
			defaultLocale: string;
			fields: {
				parentPage: FieldSchemaType;
			};
		},
	],
	Array<{
		key: string;
		collection_document_id: number;
		collection_brick_id: number;
		locale_code: string;
		text_value: string | null;
		document_id: number | null;
	}>
> = async (context, data) => {
	const parentFields = await context.db
		.selectFrom("lucid_collection_document_fields")
		.select([
			"key",
			"text_value",
			"document_id",
			"collection_brick_id",
			"locale_code",
			"collection_document_id",
		])
		.where("key", "in", [
			constants.fields.slug.key,
			constants.fields.fullSlug.key,
			constants.fields.parentPage.key,
		])
		.where("collection_document_id", "=", data.fields.parentPage.value)
		.execute();

	if (!parentFields || parentFields.length === 0) {
		return {
			error: {
				type: "basic",
				status: 404,
				message: T("parent_page_not_found"),
				errorResponse: {
					body: {
						fields: [
							{
								brickId: constants.collectionFieldBrickId,
								groupId: undefined,
								key: constants.fields.parentPage.key,
								localeCode: data.defaultLocale,
								message: T("parent_page_not_found"),
							},
						],
					},
				},
			},
			data: undefined,
		};
	}

	try {
		return {
			error: undefined,
			data: parentFields,
		};
	} catch (error) {
		return {
			error: {
				type: "basic",
				status: 500,
				message: T("an_unknown_error_occurred_getting_parent_fields"),
			},
			data: undefined,
		};
	}
};

export default getParentFields;
