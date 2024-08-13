import {
	getDescendantFields,
	getTargetCollection,
	constructChildFullSlug,
	updateFullSlugFields,
} from "../index.js";
import constants from "../../constants.js";
import type { LucidHookCollection } from "@lucidcms/core/types";
import type { PluginOptionsInternal } from "../../types/index.js";

const afterUpsertHandler =
	(
		options: PluginOptionsInternal,
	): LucidHookCollection<"afterUpsert">["handler"] =>
	async (context, data) => {
		// ----------------------------------------------------------------
		// Validation / Setup
		const targetCollectionRes = getTargetCollection({
			options,
			collectionKey: data.meta.collectionKey,
		});
		if (targetCollectionRes.error) {
			return {
				error: undefined,
				data: undefined,
			};
		}

		// ----------------------------------------------------------------
		// Build and store fullSlugs
		const descendantsRes = await getDescendantFields(context, {
			documentId: data.data.documentId,
		});
		if (descendantsRes.error) return descendantsRes;

		// exit early - nothing to do
		if (descendantsRes.data.length === 0) {
			return {
				error: undefined,
				data: undefined,
			};
		}

		const currentFullSlugField = data.data.fields.find((field) => {
			return field.key === constants.fields.fullSlug.key;
		});
		if (!currentFullSlugField) {
			return {
				error: undefined,
				data: undefined,
			};
		}

		const docFullSlugsRes = constructChildFullSlug({
			descendants: descendantsRes.data,
			localisation: context.config.localisation,
			parentFullSlugField: currentFullSlugField,
			collection: targetCollectionRes.data,
		});
		if (docFullSlugsRes.error) return docFullSlugsRes;

		await updateFullSlugFields(context, {
			docFullSlugs: docFullSlugsRes.data,
		});

		return {
			error: undefined,
			data: undefined,
		};
	};

export default afterUpsertHandler;
