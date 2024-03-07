import type { CategoryResT } from "@headless/types/src/categories.js";

const formatCategory = (
	category: {
		id: number;
		created_at: Date | null;
		updated_at: Date | null;
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
	},
	config: {
		isMultiple: boolean;
		languageId?: number;
	},
): CategoryResT => {
	return {
		id: category.id,
		collection_key: category.collection_key,
		slug: category.slug,
		title_translations: config.isMultiple
			? [
					{
						value: category.title_translation_value ?? null,
						language_id: config.languageId ?? null,
					},
			  ]
			: category.title_translations ?? [],
		description_translations: config.isMultiple
			? [
					{
						value: category.description_translation_value ?? null,
						language_id: config.languageId ?? null,
					},
			  ]
			: category.description_translations ?? [],

		created_at: category.created_at?.toISOString() ?? null,
		updated_at: category.updated_at?.toISOString() ?? null,
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

export default formatCategory;
