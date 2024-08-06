import T from "../translations/index.js";
import constants from "../constants.js";
import type { LucidHookCollection } from "@lucidcms/core/types";

/*
    / slug validation: either / or string with no slashes and limited characters types


    * 1. Fetch all of the field values from props.data.fields (slug, fullSlug, parentPage)
    * 2. If parentPage is equal to props.data.documentId - return error
    * 3. If parentPage is set and the slug is '/' - return error (would cause fullSlug to be same as parents fullSlug just with trainling slash)
    * 4. Query documents that have same slug and parentPage as the current document - return duplicate error (would also stop duplicate homepages* (/))

    / If a parentPage is found 
        * 5.1. Recursively fetch all parent fields
        * 5.2. Check that none of the parents have the current documentId as their parentPage (query might need updating - currently might be infinite loop?)
        * 5.3. Group parent fields by the collection_document_id to make easier to work with
        * 5.4. Construct the fullSlug by concatenating the slugs of the parent pages (use the plugin config prefix if set as well)
        * 5.5. Set the computed fullSlug value against the coresponding field
    / If no parentPage is found
        * 5.1. Set the fullSlug to the slug
*/

const beforeUpsertHandler: LucidHookCollection<"beforeUpsert">["handler"] =
	async (props) => {
		const parentPage = props.data.fields?.find(
			(f) =>
				f.key === constants.fields.parentPage.key &&
				f.type === "document",
		);
		const slug = props.data.fields?.find(
			(f) => f.key === constants.fields.slug.key && f.type === "text",
		);
		const fullSlug = props.data.fields?.find(
			(f) => f.key === constants.fields.fullSlug.key && f.type === "text",
		);

		//! Fields dont exist
		if (!parentPage && !slug && !fullSlug) {
			return {
				error: {
					type: "basic",
					status: 400,
					message: T("cannot_find_required_fields_message"),
				},
				data: undefined,
			};
		}

		//! Page parent of itself
		if (parentPage && parentPage.value === props.data.documentId) {
			return {
				error: {
					type: "basic",
					status: 400,
					message: T("cannot_have_self_as_parent_page_message"),
					errorResponse: {
						body: {
							fields: [
								{
									brickId: constants.collectionFieldBrickId,
									groupId: undefined,
									key: constants.fields.parentPage.key,
									localeCode:
										props.config.localisation.defaultLocale, //* parentPage doesnt use translations so always use default locale
									message: T(
										"cannot_have_self_as_parent_page_message",
									),
								},
							],
						},
					},
				},
				data: undefined,
			};
		}

		// If we have a parentPage field, get its slug, fullSlug and parentPage fields - then those same fields of its parent page (recursively)
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
								constants.fields.slug.key,
								constants.fields.fullSlug.key,
								constants.fields.parentPage.key,
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
											constants.fields.slug.key,
											constants.fields.fullSlug.key,
											constants.fields.parentPage.key,
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
		if (fullSlug && slug) {
			fullSlug.value = slug.value;
		}

		return {
			error: undefined,
			data: props.data,
		};
	};

export default beforeUpsertHandler;
