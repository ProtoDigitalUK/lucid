import type { LucidHookCollection } from "@lucidcms/core/types";

/*
    ! Not 100% decided on the homepage flag (over complicates things and can be managed by the user)

    * 1. Fetch all of the field values from props.data.fields (slug, fullSlug, parentPage, homepage)
    * 2. If parentPage is equal to props.data.documentId - return error
    * 3. If parentPage is set and its also a homepage - return error (homepages cant have parents)

    / If a parentPage is found and its not a homepage
        * 3.1. Recursively fetch all parent fields
        * 3.2. Check none of the parents are the homepage, homepages cant be or have parents - return error
        * 3.3. Check that none of the parents have the current documentId as their parentPage (query might need updating - currently might be infinite loop?)
        * 3.4. Group parent fields by the collection_document_id to make easier to work with
        * 3.5. Construct the fullSlug by concatenating the slugs of the parent pages (use the plugin config prefix if set as well)
        * 3.6. Set the computed fullSlug value against the coresponding field
        * 3.7. Set homepage to false (0)
    / If no parentPage is found and its not a homepage
        * 3.1. Set the fullSlug to the slug and set homepage to false (0)

    / If it is a homepage
        * 4.1. Find the current homepage and set the fullSlug, slug to generated value and set homepage to false (0)
        * 4.2. Set the fullSlug and slug to / and set homepage to true (1)
*/

const beforeUpsertHandler: LucidHookCollection<"beforeUpsert">["handler"] =
	async (props) => {
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
