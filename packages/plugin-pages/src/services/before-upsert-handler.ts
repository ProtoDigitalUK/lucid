import T from "../translations/index.js";
import constants from "../constants.js";
import { checkDuplicateSlugParents } from "./checks/index.js";
import type { PluginOptionsInternal } from "../types/index.js";
import type {
	LucidHookCollection,
	FieldErrors,
	FieldSchemaType,
} from "@lucidcms/core/types";

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

const beforeUpsertHandler =
	(
		options: PluginOptionsInternal,
	): LucidHookCollection<"beforeUpsert">["handler"] =>
	async (context, data) => {
		//----------------------------------------------------------------
		// Setup
		const targetCollection = options.collections.find(
			(c) => c.key === data.meta.collectionKey,
		);
		//* should never happen
		if (!targetCollection) {
			return {
				error: {
					type: "basic",
					status: 500,
					message: T("cannot_find_collection", {
						collection: data.meta.collectionKey,
					}),
				},
				data: undefined,
			};
		}

		// target fields
		const parentPageField = data.data.fields?.find(
			(f) =>
				f.key === constants.fields.parentPage.key &&
				f.type === "document",
		);
		const slugField = data.data.fields?.find(
			(f) => f.key === constants.fields.slug.key && f.type === "text",
		);
		//* dont care what this value is - only needed to update translations/value
		const fullSlugField = data.data.fields?.find(
			(f) => f.key === constants.fields.fullSlug.key && f.type === "text",
		);

		//----------------------------------------------------------------
		// Validation

		// TODO: need to validate slug value - hook happens prevalidation so must be done here

		//! Fields dont exist
		if (
			parentPageField === undefined &&
			slugField === undefined &&
			fullSlugField === undefined
		) {
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
		if (
			parentPageField?.value &&
			parentPageField.value === data.data.documentId
		) {
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
										context.config.localisation
											.defaultLocale, //* parentPage doesnt use translations so always use default locale
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

		//! Slug is / and parentPage is set (would cause fullSlug to be the same as parentPage just with trailing slash)
		if (targetCollection.slug.translations && slugField?.translations) {
			const fieldErrors: FieldErrors[] = [];
			for (const [key, value] of Object.entries(slugField.translations)) {
				if (value === "/" && parentPageField?.value) {
					fieldErrors.push({
						brickId: constants.collectionFieldBrickId,
						groupId: undefined,
						key: constants.fields.slug.key,
						localeCode: key,
						message: T(
							"slug_cannot_be_slash_and_parent_page_set_message",
						),
					});
				}
			}
			if (fieldErrors.length > 0) {
				return {
					error: {
						type: "basic",
						status: 400,
						message: T(
							"slug_cannot_be_slash_and_parent_page_set_message",
						),
						errorResponse: {
							body: {
								fields: fieldErrors,
							},
						},
					},
					data: undefined,
				};
			}
		} else if (slugField?.value === "/" && parentPageField?.value) {
			return {
				error: {
					type: "basic",
					status: 400,
					message: T(
						"slug_cannot_be_slash_and_parent_page_set_message",
					),
					errorResponse: {
						body: {
							fields: [
								{
									brickId: constants.collectionFieldBrickId,
									groupId: undefined,
									key: constants.fields.parentPage.key,
									localeCode:
										context.config.localisation
											.defaultLocale,
									message: T(
										"slug_cannot_be_slash_and_parent_page_set_message",
									),
								},
							],
						},
					},
				},
				data: undefined,
			};
		}

		//! Query for document fields that have same slug and parentPage for each slug translation (would cause duplicate fullSlug)
		const checkDuplicateSlugParentsRes = await checkDuplicateSlugParents(
			context,
			{
				documentId: data.data.documentId,
				collectionKey: targetCollection.key,
				fields: {
					slug: slugField as FieldSchemaType,
					parentPage: parentPageField as FieldSchemaType,
				},
			},
		);
		if (checkDuplicateSlugParentsRes.error)
			return checkDuplicateSlugParentsRes;

		// ----------------------------------------------------------------
		// Construct fullSlug

		// TODO: bellow is WIP
		if (parentPageField?.value) {
			// If we have a parentPage field, get its slug, fullSlug and parentPage fields - then those same fields of its parent page (recursively)
			// TODO: will currently loop forever if documents have parents pointing to each other
			const parentFields = await context.db
				.withRecursive(
					"ancestorFields(key, text_value, document_id, bool_value, collection_brick_id, locale_code, collection_document_id)",
					(db) =>
						db
							// Base case: Select fields for the initial parentPage value
							.selectFrom("lucid_collection_document_fields")
							.where(
								"collection_document_id",
								"=",
								parentPageField.value,
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

			// ----------------------------------------------------------------
			// Testing only - remove
			if (targetCollection.slug.translations && slugField?.translations) {
				for (const [key, value] of Object.entries(
					slugField.translations,
				)) {
					if (!fullSlugField) continue; //* never gets hit - type issue despite prior check
					if (!fullSlugField?.translations)
						fullSlugField.translations = {};
					fullSlugField.translations[key] = value;
				}
			} else {
				if (!fullSlugField || !slugField) {
					return {
						error: {
							type: "basic",
							status: 500,
							message: T("cannot_find_required_fields_message"),
						},
						data: undefined,
					};
				}
				fullSlugField.value = slugField.value;
			}
			// ----------------------------------------------------------------
		} else {
			// set fullSlug to slug for each slug translation
			if (targetCollection.slug.translations && slugField?.translations) {
				for (const [key, value] of Object.entries(
					slugField.translations,
				)) {
					if (!fullSlugField) continue; //* never gets hit - type issue despite prior check
					if (!fullSlugField?.translations)
						fullSlugField.translations = {};
					fullSlugField.translations[key] = value;
				}
			} else {
				if (!fullSlugField || !slugField) {
					return {
						error: {
							type: "basic",
							status: 500,
							message: T("cannot_find_required_fields_message"),
						},
						data: undefined,
					};
				}
				fullSlugField.value = slugField.value;
			}
		}

		return {
			error: undefined,
			data: data.data,
		};
	};

export default beforeUpsertHandler;
