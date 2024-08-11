import T from "../../translations/index.js";
import constants from "../../constants.js";
import { sql } from "kysely";
import type { ServiceFn, FieldSchemaType } from "@lucidcms/core/types";

/**
 *  Recursively checks all parent pages for a circular reference and errors in that case
 */
const checkCircularParents: ServiceFn<
	[
		{
			defaultLocale: string;
			documentId?: number;
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
					.select([
						"collection_document_id",
						"document_id",
						sql<number>`1`.as("depth"),
					])
					.where(
						"collection_document_id",
						"=",
						data.fields.parentPage.value,
					)
					.where("key", "=", "parentPage")
					.unionAll(
						db
							.selectFrom(
								"lucid_collection_document_fields as lcdf",
							)
							.innerJoin(
								// @ts-expect-error
								"recursive_cte as rc",
								"rc.document_id",
								"lcdf.collection_document_id",
							)
							// @ts-expect-error
							.select([
								"lcdf.collection_document_id",
								"lcdf.document_id",
								sql<number>`rc.depth + 1`.as("depth"),
							])
							.where("lcdf.key", "=", "parentPage")
							.where(
								"rc.depth",
								"<",
								constants.maxHierarchyDepth,
							),
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
									message: T(
										"circular_parents_error_message",
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
			data: undefined,
		};
	} catch (error) {
		return {
			error: {
				type: "basic",
				status: 500,
				message: T(
					"an_unknown_error_occurred_checking_for_circular_parents",
				),
			},
			data: undefined,
		};
	}
};

export default checkCircularParents;
