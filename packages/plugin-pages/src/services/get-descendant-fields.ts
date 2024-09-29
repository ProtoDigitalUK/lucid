import T from "../translations/index.js";
import constants from "../constants.js";
import type { ServiceFn, DocumentVersionType } from "@lucidcms/core/types";

export type DescendantFieldsResponse = {
	collection_document_id: number;
	collection_document_version_id: number;
	fields: {
		key: string;
		collection_document_id: number;
		collection_document_version_id: number;
		locale_code: string;
		text_value: string | null;
		document_id: number | null;
	}[];
};

/**
 *  Get the descendant document pages fields
 */
const getDescendantFields: ServiceFn<
	[
		{
			ids: number[];
			versionType: Exclude<DocumentVersionType, "revision">;
		},
	],
	Array<DescendantFieldsResponse>
> = async (context, data) => {
	try {
		const descendants = await context.db
			.with("recursive_cte", (db) =>
				db
					.selectFrom("lucid_collection_document_fields as lcdf")
					.innerJoin(
						"lucid_collection_document_versions as lcdv",
						"lcdv.id",
						"lcdf.collection_document_version_id",
					)
					.select([
						"lcdv.document_id as collection_document_id",
						"lcdf.document_id",
						"lcdf.collection_document_version_id",
					])
					.where("lcdf.document_id", "in", data.ids)
					.where("lcdf.key", "=", "parentPage")
					.where("lcdv.version_type", "=", data.versionType)
					.unionAll(
						db
							.selectFrom("lucid_collection_document_fields as lcdf")
							.innerJoin(
								"lucid_collection_document_versions as lcdv",
								"lcdv.id",
								"lcdf.collection_document_version_id",
							)
							.innerJoin(
								// @ts-expect-error
								"recursive_cte as rc",
								"rc.collection_document_id",
								"lcdf.document_id",
							)
							// @ts-expect-error
							.select([
								"lcdv.document_id as collection_document_id",
								"lcdf.document_id",
								"lcdf.collection_document_version_id",
							])
							.where("lcdf.key", "=", "parentPage")
							.where("lcdv.version_type", "=", data.versionType),
					),
			)
			.selectFrom("recursive_cte")
			.select((eb) => [
				"collection_document_id",
				"collection_document_version_id",
				context.config.db
					.jsonArrayFrom(
						eb
							.selectFrom("lucid_collection_document_fields as lcdf")
							.innerJoin(
								"lucid_collection_document_versions as lcdv",
								"lcdv.id",
								"lcdf.collection_document_version_id",
							)
							.select([
								"lcdf.key",
								"lcdf.text_value",
								"lcdf.document_id",
								"lcdv.document_id as collection_document_id",
								"lcdf.collection_document_version_id",
								"lcdf.locale_code",
							])
							.where("lcdf.key", "in", [
								constants.fields.slug.key,
								constants.fields.fullSlug.key,
								constants.fields.parentPage.key,
							])
							.whereRef(
								"lcdv.document_id",
								"=",
								"recursive_cte.collection_document_id",
							)
							.where("lcdv.version_type", "=", data.versionType),
					)
					.as("fields"),
			])
			.where("collection_document_id", "not in", data.ids)
			.execute();

		return {
			error: undefined,
			data: descendants.filter((d, i, self) => {
				return (
					self.findIndex(
						(e) =>
							e.collection_document_id === d.collection_document_id &&
							e.collection_document_version_id ===
								d.collection_document_version_id,
					) === i
				);
			}),
		};
	} catch (error) {
		console.error("Error in getDescendantFields:", error);
		return {
			error: {
				type: "basic",
				status: 500,
				message: T("an_unknown_error_occurred_getting_descendant_fields"),
			},
			data: undefined,
		};
	}
};

export default getDescendantFields;
