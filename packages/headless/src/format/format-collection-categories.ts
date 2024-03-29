import type { CategoryResT } from "@headless/types/src/categories.js";
import { formatDate } from "../utils/format-helpers.js";

interface FormatCollectionCateogriesT {
	category: {
		id: number;
		created_at: Date | string | null;
		updated_at: Date | string | null;
		collection_key: string;
		description_translation_key_id: number | null;
		slug: string;
		title_translation_key_id: number | null;
		title_translations?: Array<{
			value: string | null;
			language_id: number | null;
		}>;
		description_translations?: Array<{
			value: string | null;
			language_id: number | null;
		}>;
		title_translation_value?: string | null;
		description_translation_value?: string | null;
	};
}

const formatCollectionCategories = (
	props: FormatCollectionCateogriesT,
): CategoryResT => {
	return {
		id: props.category.id,
		collection_key: props.category.collection_key,
		slug: props.category.slug,
		title_translations: props.category.title_translations ?? [],
		description_translations: props.category.description_translations ?? [],
		created_at: formatDate(props.category.created_at),
		updated_at: formatDate(props.category.updated_at),
	};
};

export const swaggerCategoryRes = {
	type: "object",
	properties: {
		id: { type: "number", example: 1 },
		collection_key: { type: "string", example: "blogs" },
		slug: { type: "string", example: "technology" },
		title_translations: {
			type: "array",
			items: {
				type: "object",
				properties: {
					language_id: { type: "number", example: 1 },
					value: {
						type: "string",
						example: "Technology",
						nullable: true,
					},
				},
			},
		},
		description_translations: {
			type: "array",
			items: {
				type: "object",
				properties: {
					language_id: { type: "number", example: 1 },
					value: {
						type: "string",
						example: "Technology Description",
						nullable: true,
					},
				},
			},
		},
		created_at: { type: "string", example: "2022-01-01T00:00:00Z" },
		updated_at: { type: "string", example: "2022-01-01T00:00:00Z" },
	},
};

export default formatCollectionCategories;
