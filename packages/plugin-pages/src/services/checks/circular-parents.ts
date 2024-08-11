import T from "../../translations/index.js";
import constants from "../../constants.js";
import type { ServiceFn, FieldSchemaType } from "@lucidcms/core/types";

//* Query works as expected - but not very elegant as its only checking the first 10 levels of parents, update in the future if this is an issue

// TODO: this needs checking out - doesnt seem to be working - throws error when trying to set a second doc to have the same parentPage

/**
 *  Recursively checks all parent pages for a circular reference and errors in that case
 */
const checkCircularParents: ServiceFn<
	[
		{
			defaultLocale: string;
			fields: {
				parentPage: FieldSchemaType;
			};
		},
	],
	undefined
> = async (context, data) => {
	try {
		let query = context.db
			.selectFrom("lucid_collection_document_fields as fields")
			.select("fields.document_id")
			.where("fields.key", "=", "parentPage")
			.where("fields.document_id", "=", data.fields.parentPage.value);

		for (let i = 1; i < constants.maxHierarchyDepth; i++) {
			query = query.unionAll(
				context.db
					.selectFrom("lucid_collection_document_fields as fields")
					.select("fields.document_id")
					.where("fields.key", "=", "parentPage")
					.where(
						"fields.collection_document_id",
						"=",
						context.db
							.selectFrom("lucid_collection_document_fields")
							.select("document_id")
							.where("key", "=", "parentPage")
							.where(
								"collection_document_id",
								"=",
								data.fields.parentPage.value,
							),
					),
			);
		}

		const result = await query
			.where(
				"fields.collection_document_id",
				"=",
				data.fields.parentPage.value,
			)
			.execute();

		if (result.length > 0) {
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
