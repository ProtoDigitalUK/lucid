import T from "../translations/index.js";
import constants from "../constants.js";
import type { ServiceFn } from "@lucidcms/core/types";

export type DescendantFieldsResponse = {
	collection_document_id: number;
	fields: {
		key: string;
		collection_document_id: number;
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
		},
	],
	Array<DescendantFieldsResponse>
> = async (context, data) => {
	try {
		const descendants = await context.db
			.with("recursive_cte", (db) =>
				db
					.selectFrom("lucid_collection_document_fields as lcdf")
					.select(["lcdf.collection_document_id", "lcdf.document_id"])
					.where("lcdf.document_id", "in", data.ids)
					.where("lcdf.key", "=", "parentPage")
					.unionAll(
						db
							.selectFrom(
								"lucid_collection_document_fields as lcdf",
							)
							.innerJoin(
								// @ts-expect-error
								"recursive_cte as rc",
								"rc.collection_document_id",
								"lcdf.document_id",
							)
							// @ts-expect-error
							.select([
								"lcdf.collection_document_id",
								"lcdf.document_id",
							])
							.where("lcdf.key", "=", "parentPage"),
					),
			)
			.selectFrom("recursive_cte")
			.select((eb) => [
				"collection_document_id",
				context.config.db
					.jsonArrayFrom(
						eb
							.selectFrom("lucid_collection_document_fields")
							.select([
								"lucid_collection_document_fields.key",
								"lucid_collection_document_fields.text_value",
								"lucid_collection_document_fields.document_id",
								"lucid_collection_document_fields.collection_document_id",
								"lucid_collection_document_fields.locale_code",
							])
							.where("key", "in", [
								constants.fields.slug.key,
								constants.fields.fullSlug.key,
								constants.fields.parentPage.key,
							])
							.whereRef(
								"lucid_collection_document_fields.collection_document_id",
								"=",
								"recursive_cte.collection_document_id",
							),
					)
					.as("fields"),
			])
			.execute();

		return {
			error: undefined,
			data: descendants.filter((d, i, self) => {
				return (
					self.findIndex(
						(e) =>
							e.collection_document_id ===
							d.collection_document_id,
					) === i
				);
			}),
		};
	} catch (error) {
		return {
			error: {
				type: "basic",
				status: 500,
				message: T(
					"an_unknown_error_occurred_getting_descendant_fields",
				),
			},
			data: undefined,
		};
	}
};

export default getDescendantFields;
