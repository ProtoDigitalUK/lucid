import constants from "../../constants.js";
import {
	checkDuplicateSlugParents,
	checkFieldsExist,
	checkCircularParents,
} from "../checks/index.js";
import {
	getTargetCollection,
	getParentFields,
	constructParentFullSlug,
	setFullSlug,
	getDocumentVersionFields,
	updateFullSlugFields,
} from "../index.js";
import fieldResToSchema from "../../utils/field-res-to-schema.js";
import afterUpsertHandler from "./after-upsert-handler.js";
import type { PluginOptionsInternal } from "../../types/index.js";
import type { LucidHookCollection } from "@lucidcms/core/types";

const versionPromoteHandler =
	(
		options: PluginOptionsInternal,
	): LucidHookCollection<"versionPromote">["handler"] =>
	async (context, data) => {
		// ----------------------------------------------------------------
		// Validation / Setup
		const targetCollectionRes = getTargetCollection({
			options,
			collectionKey: data.meta.collectionKey,
		});
		if (targetCollectionRes.error) {
			//* early return as doesnt apply to the current collection
			return {
				error: undefined,
				data: undefined,
			};
		}

		let createFullSlug = true;

		// fetch the document versions, slug and parent page fields
		const docVersionFieldRes = await getDocumentVersionFields(context, {
			documentId: data.data.documentId,
			versionId: data.data.versionId,
			versionType: data.data.versionType,
		});
		if (docVersionFieldRes.error) return docVersionFieldRes;
		if (docVersionFieldRes.data === null) createFullSlug = false;

		// Format fields
		const checkFieldsExistRes = checkFieldsExist({
			fields: {
				slug: fieldResToSchema(
					constants.fields.slug.key,
					targetCollectionRes.data.enableTranslations,
					context.config.localisation.defaultLocale,
					docVersionFieldRes.data || [],
				),
				parentPage: fieldResToSchema(
					constants.fields.parentPage.key,
					false,
					context.config.localisation.defaultLocale,
					docVersionFieldRes.data || [],
				),
				fullSlug: fieldResToSchema(
					constants.fields.fullSlug.key,
					targetCollectionRes.data.enableTranslations,
					context.config.localisation.defaultLocale,
					docVersionFieldRes.data || [],
				),
			},
		});
		if (checkFieldsExistRes.error) return checkFieldsExistRes;
		const { slug, parentPage, fullSlug } = checkFieldsExistRes.data;

		// ----------------------------------------------------------------
		// create fullSlug - close to the beforeUpsert hook
		if (createFullSlug) {
			const checkDuplicateSlugParentsRes = await checkDuplicateSlugParents(
				context,
				{
					documentId: data.data.documentId,
					versionId: data.data.versionId,
					versionType: data.data.versionType,
					collectionKey: targetCollectionRes.data.collectionKey,
					fields: {
						slug: slug,
						parentPage: parentPage,
					},
				},
			);
			if (checkDuplicateSlugParentsRes.error)
				return checkDuplicateSlugParentsRes;

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
					versionType: data.data.versionType,
					defaultLocale: context.config.localisation.defaultLocale,
					fields: {
						parentPage: parentPage,
					},
				});
				if (circularParentsRes.error) return circularParentsRes;

				const parentFieldsRes = await getParentFields(context, {
					defaultLocale: context.config.localisation.defaultLocale,
					versionType: data.data.versionType,
					fields: {
						parentPage: parentPage,
					},
				});
				if (parentFieldsRes.error) return parentFieldsRes;

				parentFieldsData = parentFieldsRes.data;
			}

			// fullSlug construction
			const fullSlugRes = constructParentFullSlug({
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

			const updateFullSlugRes = await updateFullSlugFields(context, {
				docFullSlugs: [
					{
						documentId: data.data.documentId,
						versionId: data.data.versionId,
						fullSlugs: fullSlugRes.data,
					},
				],
				versionType: data.data.versionType,
			});
			if (updateFullSlugRes.error) return updateFullSlugRes;
		}

		// ----------------------------------------------------------------
		// run the afterUpsert hook to update all of the documents versions potential descendants
		await afterUpsertHandler(options)(context, {
			meta: {
				collectionKey: data.meta.collectionKey,
				userId: data.meta.userId,
			},
			data: {
				documentId: data.data.documentId,
				versionId: data.data.versionId,
				versionType: data.data.versionType,
				bricks: [],
				fields: [slug, parentPage, fullSlug],
			},
		});

		return {
			error: undefined,
			data: undefined,
		};
	};

export default versionPromoteHandler;
