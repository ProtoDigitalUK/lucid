import T from "../translations/index.js";
import constants from "../constants.js";
import type {
	ServiceFn,
	FieldSchemaType,
	DocumentVersionType,
} from "@lucidcms/core/types";

/**
 *  Get the target document versions slug, fullSlug and parentPage fields
 */
const getDocumentVersionFields: ServiceFn<
	[
		{
			documentId: number;
			versionId: number;
			versionType: Exclude<DocumentVersionType, "revision">;
		},
	],
	Array<{
		key: string;
		collection_document_id: number;
		collection_brick_id: number;
		locale_code: string;
		text_value: string | null;
		document_id: number | null;
	}> | null
> = async (context, data) => {
	try {
		const fields = await context.db
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
			])
			.where(
				"lucid_collection_document_versions.document_id",
				"=",
				data.documentId,
			)
			.where("lucid_collection_document_versions.id", "=", data.versionId)
			.where(
				"lucid_collection_document_versions.version_type",
				"=",
				data.versionType,
			)
			.where("lucid_collection_document_fields.key", "in", [
				constants.fields.slug.key,
				constants.fields.fullSlug.key,
				constants.fields.parentPage.key,
			])
			.execute();

		if (!fields || fields.length === 0) {
			return {
				error: undefined,
				data: null,
			};
		}

		return {
			error: undefined,
			data: fields,
		};
	} catch (error) {
		return {
			error: {
				type: "basic",
				status: 500,
				message: T("an_unknown_error_occurred_getting_document_version_fields"),
			},
			data: undefined,
		};
	}
};

export default getDocumentVersionFields;
