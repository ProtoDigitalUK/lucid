import {
	getTargetCollection,
	constructChildFullSlug,
	getDescendantFields,
	updateFullSlugFields,
} from "../index.js";
import type { PluginOptionsInternal } from "../../types/index.js";
import type { LucidHookCollection } from "@lucidcms/core/types";

const beforeDeleteHandler =
	(
		options: PluginOptionsInternal,
	): LucidHookCollection<"beforeDelete">["handler"] =>
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

		const descendantsRes = await getDescendantFields(context, {
			ids: data.data.ids,
		});
		if (descendantsRes.error) return descendantsRes;

		// exit early - nothing to do
		if (descendantsRes.data.length === 0) {
			return {
				error: undefined,
				data: undefined,
			};
		}

		const docFullSlugsRes = constructChildFullSlug({
			descendants: descendantsRes.data,
			localisation: context.config.localisation,
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

export default beforeDeleteHandler;
