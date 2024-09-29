import T from "../../translations/index.js";
import constants from "../../constants.js";
import { sql } from "kysely";
import type {
	ServiceFn,
	FieldSchemaType,
	DocumentVersionType,
} from "@lucidcms/core/types";

/**
 *  Recursively checks all parent pages for a circular reference and errors in that case
 */
const checkCircularParents: ServiceFn<
	[
		{
			defaultLocale: string;
			documentId: number;
			versionType: Exclude<DocumentVersionType, "revision">;
			fields: {
				parentPage: FieldSchemaType;
			};
		},
	],
	undefined
> = async (context, data) => {
	try {
		if (!data.documentId) {
			return {
				error: undefined,
				data: undefined,
			};
		}

		const result = await context.db
			.with("recursive_cte", (db) =>
				db
					.selectFrom("lucid_collection_document_fields")
					.innerJoin(
						"lucid_collection_document_versions",
						"lucid_collection_document_versions.id",
						"lucid_collection_document_fields.collection_document_version_id",
					)
					.select([
						"lucid_collection_document_versions.document_id",
						"lucid_collection_document_fields.document_id as parent_document_id",
						sql<number>`1`.as("depth"),
					])
					.where(
						"lucid_collection_document_versions.document_id",
						"=",
						data.fields.parentPage.value,
					)
					.where("lucid_collection_document_fields.key", "=", "parentPage")
					.where(
						"lucid_collection_document_versions.version_type",
						"=",
						data.versionType,
					)
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
								"rc.parent_document_id",
								"lcdv.document_id",
							)
							// @ts-expect-error
							.select([
								"lcdv.document_id",
								"lcdf.document_id as parent_document_id",
								sql<number>`rc.depth + 1`.as("depth"),
							])
							.where("lcdf.key", "=", "parentPage")
							.where("lcdv.version_type", "=", data.versionType)
							.where("rc.depth", "<", constants.maxHierarchyDepth),
					),
			)
			.selectFrom("recursive_cte")
			.select(
				sql<number>`case when count(*) > 0 then 1 else 0 end`.as(
					"has_circular_ref",
				),
			)
			.where("document_id", "=", data.documentId)
			.executeTakeFirstOrThrow();

		if (result.has_circular_ref === 1) {
			return {
				error: {
					type: "basic",
					status: 400,
					message: T("circular_parents_error_message"),
					errorResponse: {
						body: {
							fields: [
								{
									brickId: constants.collectionFieldBrickId,
									groupId: undefined,
									key: constants.fields.parentPage.key,
									localeCode: data.defaultLocale, //* parentPage doesnt use translations so always use default locale
									message: T("circular_parents_error_message"),
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
	} catch (error) {
		return {
			error: {
				type: "basic",
				status: 500,
				message: T("an_unknown_error_occurred_checking_for_circular_parents"),
			},
			data: undefined,
		};
	}
};

export default checkCircularParents;
