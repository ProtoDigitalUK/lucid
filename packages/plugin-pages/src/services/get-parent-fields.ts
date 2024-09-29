import T from "../translations/index.js";
import constants from "../constants.js";
import type {
	ServiceFn,
	FieldSchemaType,
	DocumentVersionType,
} from "@lucidcms/core/types";

/**
 *  Get the parent document pages fields
 */
const getParentFields: ServiceFn<
	[
		{
			defaultLocale: string;
			versionType: Exclude<DocumentVersionType, "revision">;
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
	try {
		const parentFields = await context.db
			.selectFrom("lucid_collection_document_fields")
			.innerJoin(
				"lucid_collection_document_versions",
				"lucid_collection_document_versions.id",
				"lucid_collection_document_fields.collection_document_version_id",
			)
			.select([
				"lucid_collection_document_fields.key",
				"lucid_collection_document_fields.text_value",
				"lucid_collection_document_fields.document_id",
				"lucid_collection_document_fields.collection_brick_id",
				"lucid_collection_document_fields.locale_code",
				"lucid_collection_document_versions.document_id as collection_document_id",
				"lucid_collection_document_fields.collection_document_version_id",
			])
			.where("lucid_collection_document_fields.key", "in", [
				constants.fields.slug.key,
				constants.fields.fullSlug.key,
				constants.fields.parentPage.key,
			])
			.where(
				"lucid_collection_document_versions.document_id",
				"=",
				data.fields.parentPage.value,
			)
			.where(
				"lucid_collection_document_versions.version_type",
				"=",
				data.versionType,
			)
			.execute();

		if (!parentFields || parentFields.length === 0) {
			return {
				error: {
					type: "basic",
					status: 404,
					message: T(
						"parent_page_not_found_or_doesnt_have_a_published_version",
					),
					errorResponse: {
						body: {
							fields: [
								{
									brickId: constants.collectionFieldBrickId,
									groupId: undefined,
									key: constants.fields.parentPage.key,
									localeCode: data.defaultLocale,
									message: T(
										"parent_page_not_found_or_doesnt_have_a_published_version",
									),
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
