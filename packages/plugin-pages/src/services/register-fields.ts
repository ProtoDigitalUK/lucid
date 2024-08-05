import type { CollectionConfig } from "../types/index.js";
import { type CollectionBuilder, z } from "@lucidcms/core";

const registerFields = (
	collection: CollectionBuilder,
	config: CollectionConfig,
) => {
	collection
		.addText("fullSlug", {
			labels: {
				title: "Full Slug",
			},
			translations: config.slug.translations,
			hidden: false, // TODO: make this true once testing is done
			disabled: true,
			validation: {
				required: true,
				zod: z.string().min(2).max(128),
			},
		})
		.addText("slug", {
			labels: {
				title: "Slug",
			},
			translations: config.slug.translations,
			hidden: false,
			disabled: false,
			validation: {
				required: true,
				zod: z.string().min(2).max(128),
			},
		})
		.addDocument("parentPage", {
			collection: collection.key,
			labels: {
				title: "Parent Page",
			},
			hidden: false,
			disabled: false,
		});
};

export default registerFields;
