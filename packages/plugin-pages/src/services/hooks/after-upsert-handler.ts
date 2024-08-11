import { getDescendantFields, getTargetCollection } from "../index.js";
import buildFullSlug from "../../utils/build-fullslug-from-slugs.js";
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
		if (targetCollectionRes.error) return targetCollectionRes;

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

		// TODO: move bellow into own services

		const documentFullSlugs: Array<{
			documentId: number;
			fullSlugs: Record<string, string | null>;
		}> = [];

		for (const descendant of descendantsRes.data) {
			const fullSlug: Record<string, string | null> = {};

			if (targetCollectionRes.data.slug.translations) {
				if (!currentFullSlugField.translations) break;

				for (const locale of context.config.localisation.locales) {
					const currentFullSlugValue =
						currentFullSlugField.translations[locale.code];
					if (!currentFullSlugValue) continue;

					fullSlug[locale.code] = buildFullSlug({
						targetLocale: locale.code,
						currentDescendant: descendant,
						descendants: descendantsRes.data,
						topLevelFullSlug: currentFullSlugValue,
					});
				}
			} else {
				if (!currentFullSlugField.value) break;

				fullSlug[context.config.localisation.defaultLocale] =
					buildFullSlug({
						targetLocale: context.config.localisation.defaultLocale,
						currentDescendant: descendant,
						descendants: descendantsRes.data,
						topLevelFullSlug: currentFullSlugField.value,
					});
			}

			documentFullSlugs.push({
				documentId: descendant.collection_document_id,
				fullSlugs: fullSlug,
			});
		}

		const updateFullSlugsPromises = [];
		for (const doc of documentFullSlugs) {
			for (const [locale, fullSlug] of Object.entries(doc.fullSlugs)) {
				updateFullSlugsPromises.push(
					context.db
						.updateTable("lucid_collection_document_fields")
						.set({ text_value: fullSlug })
						.where("collection_document_id", "=", doc.documentId)
						.where("locale_code", "=", locale)
						.where("key", "=", constants.fields.fullSlug.key)
						.execute(),
				);
			}
		}
		await Promise.all(updateFullSlugsPromises);

		return {
			error: undefined,
			data: undefined,
		};
	};

export default afterUpsertHandler;
