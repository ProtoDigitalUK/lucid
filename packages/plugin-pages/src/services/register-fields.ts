import T from "../translations/index.js";
import constants from "../constants.js";
import { type CollectionBuilder, z } from "@lucidcms/core";
import type { CollectionConfig } from "../types/index.js";

const registerFields = (
	collection: CollectionBuilder,
	config: CollectionConfig,
) => {
	collection
		.addText(constants.fields.fullSlug.key, {
			labels: {
				title: T("full_slug"),
			},
			translations: config.translations,
			hidden: false, // TODO: make this true once testing is done
			disabled: true,
		})
		.addText(
			constants.fields.slug.key,
			{
				labels: {
					title: T("slug"),
				},
				translations: config.translations,
				hidden: false,
				disabled: false,
				validation: {
					required: true,
					zod: z.union([
						z.literal("/"),
						z
							.string()
							.regex(
								/^[a-zA-Z0-9_-]+$/,
								T("slug_field_validation_error_message"),
							),
					]),
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
				title: T("parent_page"),
			},
			hidden: false,
			disabled: false,
		});
};

export default registerFields;
