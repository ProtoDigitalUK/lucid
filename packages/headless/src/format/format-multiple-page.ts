import type { PagesResT } from "@headless/types/src/multiple-page.js";

interface PageT {
	id: number;
	parent_id: number | null;
	collection_key: string | null;
	collection_slug: string | null;
	slug: string | null;
	full_slug: string | null;
	homepage: boolean | null;
	created_by: number | null;
	created_at: Date | null;
	updated_at: Date | null;
	published: boolean | null;
	published_at: Date | null;
	title_translation_key_id: number | null;
	excerpt_translation_key_id: number | null;
	title_translations: {
		language_id: number | null;
		value: string | null;
	}[];
	excerpt_translations: {
		language_id: number | null;
		value: string | null;
	}[];
	title_translation_value?: string | null;
	alt_translation_value?: string | null;
	categories: Array<{
		category_id: number;
	}> | null;
	author_id: number | null;
	author_email: string | null;
	author_first_name: string | null;
	author_last_name: string | null;
	author_username: string | null;
}

const formatmultiplePage = (page: PageT): PagesResT => {
	const res: PagesResT = {
		id: page.id,
		parent_id: page.parent_id,
		collection_key: page.collection_key,
		title_translations: page.title_translations,
		excerpt_translations: page.excerpt_translations,
		slug: formatPageSlug(page.slug),
		full_slug: formatPageSlug(page.full_slug),
		homepage: page.homepage ?? false,
		created_by: page.created_by,
		created_at: page.created_at?.toISOString() || null,
		updated_at: page.updated_at?.toISOString() || null,
		published: page.published ?? false,
		published_at: page.published_at?.toISOString() || null,
		author: null,
		// bricks: []
	};

	if (page.author_id) {
		res.author = {
			id: page.author_id,
			email: page.author_email,
			first_name: page.author_first_name,
			last_name: page.author_last_name,
			username: page.author_username,
		};
	}

	if (page.categories) {
		res.categories = page.categories.map(
			(category) => category.category_id,
		);
	}

	return res;
};

export const formatPageSlug = (slug: string | null) => {
	if (!slug) return null;
	if (!slug.startsWith("/")) return `/${slug}`;
	return slug;
};

export const swaggermultiplePageRes = {
	type: "object",
	properties: {
		id: {
			type: "number",
		},
		parent_id: {
			type: "number",
			nullable: true,
		},
		collection_key: {
			type: "string",
			nullable: true,
		},
		slug: {
			type: "string",
			nullable: true,
		},
		full_slug: {
			type: "string",
			nullable: true,
		},
		homepage: {
			type: "boolean",
		},
		title_translations: {
			type: "array",
			items: {
				type: "object",
				properties: {
					language_id: {
						type: "number",
						nullable: true,
					},
					value: {
						type: "string",
						nullable: true,
					},
				},
			},
		},
		excerpt_translations: {
			type: "array",
			items: {
				type: "object",
				properties: {
					language_id: {
						type: "number",
						nullable: true,
					},
					value: {
						type: "string",
						nullable: true,
					},
				},
			},
		},
		author: {
			type: "object",
			properties: {
				id: {
					type: "number",
					nullable: true,
				},
				email: {
					type: "string",
					nullable: true,
				},
				first_name: {
					type: "string",
					nullable: true,
				},
				last_name: {
					type: "string",
					nullable: true,
				},
				username: {
					type: "string",
					nullable: true,
				},
			},
			nullable: true,
		},
		categories: {
			type: "array",
			items: {
				type: "number",
			},
		},
		created_by: {
			type: "number",
			nullable: true,
		},
		created_at: {
			type: "string",
			nullable: true,
		},
		updated_at: {
			type: "string",
			nullable: true,
		},
		published: {
			type: "boolean",
			nullable: true,
		},
		published_at: {
			type: "string",
			nullable: true,
		},
	},
};

export default formatmultiplePage;
