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
			translations: config.translations,
			hidden: false, // TODO: make this true once testing is done
			disabled: true,
			validation: {
				required: true,
				zod: z.string().min(1).max(128), // TODO: probs doesnt need validation beyond required?
			},
		})
		.addText(
			constants.fields.slug.key,
			{
				labels: {
					title: "Slug",
				},
				translations: config.translations,
				hidden: false,
				disabled: false,
				validation: {
					required: true,
					// TODO: work on validation rules - no slashes, no spaces, no special characters etc (only slash is allowed if its by itself)
					zod: z.string().min(1).max(128),
				},
			},
			{
				list: true,
				filterable: true,
			},
		)
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
