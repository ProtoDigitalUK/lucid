import constants from "../../constants.js";
import {
	checkDuplicateSlugParents,
	checkRootSlugWithParent,
	checkParentIsPageOfSelf,
	checkFieldsExist,
	checkCircularParents,
} from "../checks/index.js";
import { getTargetCollection } from "../index.js";
import type { PluginOptionsInternal } from "../../types/index.js";
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

const beforeUpsertHandler =
	(
		options: PluginOptionsInternal,
	): LucidHookCollection<"beforeUpsert">["handler"] =>
	async (context, data) => {
		// TODO: should slug be validated here as the hook happens pre validation. Alternative is we allow generating invalid/slight wrong slugs and let field validation throw in that case?

		// ----------------------------------------------------------------
		// Validation / Setup

		const targetCollectionRes = getTargetCollection({
			options,
			collectionKey: data.meta.collectionKey,
		});
		if (targetCollectionRes.error) return targetCollectionRes;

		const checkFieldsExistRes = checkFieldsExist({
			fields: {
				slug: data.data.fields?.find(
					(f) =>
						f.key === constants.fields.slug.key &&
						f.type === "text",
				),
				parentPage: data.data.fields?.find(
					(f) =>
						f.key === constants.fields.parentPage.key &&
						f.type === "document",
				),
				//* dont care what this value is - only needed to update translations/value
				fullSlug: data.data.fields?.find(
					(f) =>
						f.key === constants.fields.fullSlug.key &&
						f.type === "text",
				),
			},
		});
		if (checkFieldsExistRes.error) return checkFieldsExistRes;
		const { slug, parentPage, fullSlug } = checkFieldsExistRes.data;

		const checkParentIsPageOfSelfRes = checkParentIsPageOfSelf({
			defaultLocale: context.config.localisation.defaultLocale,
			documentId: data.data.documentId,
			fields: {
				parentPage: parentPage,
			},
		});
		if (checkParentIsPageOfSelfRes.error) return checkParentIsPageOfSelfRes;

		const checkRootSlugWithParentRes = checkRootSlugWithParent({
			collection: targetCollectionRes.data,
			defaultLocale: context.config.localisation.defaultLocale,
			fields: {
				slug: slug,
				parentPage: parentPage,
			},
		});
		if (checkRootSlugWithParentRes.error) return checkRootSlugWithParentRes;

		const checkDuplicateSlugParentsRes = await checkDuplicateSlugParents(
			context,
			{
				documentId: data.data.documentId,
				collectionKey: targetCollectionRes.data.key,
				fields: {
					slug: slug,
					parentPage: parentPage,
				},
			},
		);
		if (checkDuplicateSlugParentsRes.error)
			return checkDuplicateSlugParentsRes;

		// ----------------------------------------------------------------
		// Construct fullSlug

		// TODO: bellow is WIP
		if (parentPage.value) {
			const circularParentsRes = await checkCircularParents(context, {
				defaultLocale: context.config.localisation.defaultLocale,
				fields: {
					parentPage: parentPage,
				},
			});
			if (circularParentsRes.error) return circularParentsRes;

			// If we have a parentPage field, get its slug, fullSlug and parentPage fields - then those same fields of its parent page (recursively)
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

			// ----------------------------------------------------------------
			// Testing only - remove
			if (
				targetCollectionRes.data.slug.translations &&
				slug.translations
			) {
				for (const [key, value] of Object.entries(slug.translations)) {
					if (!fullSlug?.translations) fullSlug.translations = {};
					fullSlug.translations[key] = value;
				}
			} else {
				fullSlug.value = slug.value;
			}
			// ----------------------------------------------------------------
		} else {
			// set fullSlug to slug for each slug translation
			if (
				targetCollectionRes.data.slug.translations &&
				slug.translations
			) {
				for (const [key, value] of Object.entries(slug.translations)) {
					if (!fullSlug?.translations) fullSlug.translations = {};
					fullSlug.translations[key] = value;
				}
			} else {
				fullSlug.value = slug.value;
			}
		}

		return {
			error: undefined,
			data: data.data,
		};
	};

export default beforeUpsertHandler;
