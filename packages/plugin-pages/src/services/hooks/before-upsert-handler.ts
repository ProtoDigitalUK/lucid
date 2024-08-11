import constants from "../../constants.js";
import {
	checkDuplicateSlugParents,
	checkRootSlugWithParent,
	checkParentIsPageOfSelf,
	checkFieldsExist,
	checkCircularParents,
} from "../checks/index.js";
import {
	getTargetCollection,
	getParentFields,
	constructFullSlug,
	setFullSlug,
} from "../index.js";
import type { PluginOptionsInternal } from "../../types/index.js";
import type { LucidHookCollection } from "@lucidcms/core/types";

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
		// Build and set fullSlug

		let parentFieldsData:
			| Array<{
					key: string;
					collection_document_id: number;
					collection_brick_id: number;
					locale_code: string;
					text_value: string | null;
					document_id: number | null;
			  }>
			| undefined = undefined;

		// parent page checks and query
		if (parentPage.value) {
			const circularParentsRes = await checkCircularParents(context, {
				documentId: data.data.documentId,
				defaultLocale: context.config.localisation.defaultLocale,
				fields: {
					parentPage: parentPage,
				},
			});
			if (circularParentsRes.error) return circularParentsRes;

			const parentFieldsRes = await getParentFields(context, {
				defaultLocale: context.config.localisation.defaultLocale,
				fields: {
					parentPage: parentPage,
				},
			});
			if (parentFieldsRes.error) return parentFieldsRes;

			parentFieldsData = parentFieldsRes.data;
		}

		// fullSlug construction
		const fullSlugRes = constructFullSlug({
			parentFields: parentFieldsData,
			localisation: context.config.localisation,
			collection: targetCollectionRes.data,
			fields: {
				slug: slug,
			},
		});
		if (fullSlugRes.error) return fullSlugRes;

		setFullSlug({
			fullSlug: fullSlugRes.data,
			defaultLocale: context.config.localisation.defaultLocale,
			collection: targetCollectionRes.data,
			fields: {
				fullSlug: fullSlug,
			},
		});

		return {
			error: undefined,
			data: data.data,
		};
	};

export default beforeUpsertHandler;