import constants from "../constants.js";
import type { CollectionConfig } from "../types/index.js";
import { type CollectionBuilder, z } from "@lucidcms/core";

const registerFields = (
	collection: CollectionBuilder,
	config: CollectionConfig,
) => {
	collection
		.addText(constants.fields.fullSlug.key, {
			labels: {
				title: "Full Slug",
			},
			translations: config.slug.translations,
			hidden: false, // TODO: make this true once testing is done
			disabled: true,
			validation: {
				required: true,
				zod: z.string().min(1).max(128),
			},
		})
		.addText(constants.fields.slug.key, {
			labels: {
				title: "Slug",
			},
			translations: config.slug.translations,
			hidden: false,
			disabled: false,
			validation: {
				required: true,
				zod: z.string().min(1).max(128),
			},
		})
		.addDocument(constants.fields.parentPage.key, {
			collection: collection.key,
			labels: {
				title: "Parent Page",
			},
			hidden: false,
			disabled: false,
		});
};

export default registerFields;
