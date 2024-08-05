import type { LucidHookCollection } from "@lucidcms/core/types";

// Get the parent page of the document - and the parent of those pages (recursively)
// Work out the fullSlug based on the slugs of the parent pages and this page
// Set the fullSlug value against the coresponding field
// Do this for all translations of the field if translations are enabled

const beforeUpsertHandler: LucidHookCollection<"beforeUpsert">["handler"] =
	async (props) => {
		//* Probably should be able to set a homepage as a parentPage as it would have no effect on the slug?
		//* Needs a solution for making sure parentPages arent also children of this page or equal to this page

		// IF we have a parentPage field, get its slug, fullSlug, homepage and parentPage fields - then those same fields of its parent page (recursively)
		const parentPage = props.data.fields?.find(
			(f) => f.key === "parentPage",
		);
		if (parentPage) {
			const parentFields = await props.db
				.withRecursive(
					"ancestorFields(key, text_value, document_id, bool_value, collection_brick_id, locale_code, collection_document_id)",
					(db) =>
						db
							// Base case: Select fields for the initial parentPage value
							.selectFrom("lucid_collection_document_fields")
							.where(
								"collection_document_id",
								"=",
								parentPage.value,
							)
							.where("key", "in", [
								"slug",
								"fullSlug",
								"parentPage",
								"homepage",
							])
							.select([
								"key",
								"text_value",
								"document_id",
								"bool_value",
								"collection_brick_id",
								"locale_code",
								"collection_document_id",
							])
							.unionAll(
								// Recursive case: Find fields for each parent
								db
									.selectFrom(
										"lucid_collection_document_fields",
									)
									.innerJoin(
										"ancestorFields",
										"lucid_collection_document_fields.collection_document_id",
										"ancestorFields.document_id",
									)
									.where(
										"lucid_collection_document_fields.key",
										"in",
										[
											"slug",
											"fullSlug",
											"parentPage",
											"homepage",
										],
									)
									.select([
										"lucid_collection_document_fields.key",
										"lucid_collection_document_fields.text_value",
										"lucid_collection_document_fields.document_id",
										"lucid_collection_document_fields.bool_value",
										"lucid_collection_document_fields.collection_brick_id",
										"lucid_collection_document_fields.locale_code",
										"lucid_collection_document_fields.collection_document_id",
									]),
							),
				)
				.selectFrom("ancestorFields")
				.selectAll()
				.execute();

			console.log(parentFields);
		}

		//** TEMP - for testing - also needs to work for translations as well as using computed fullSlug instead of slug
		// TODO: homepage needs taking into account as well
		const fullSlug = props.data.fields?.find((f) => f.key === "fullSlug");
		const slug = props.data.fields?.find((f) => f.key === "slug");
		if (fullSlug && slug) {
			fullSlug.value = slug.value;
		}

		return {
			error: undefined,
			data: props.data,
		};
	};

export default beforeUpsertHandler;
