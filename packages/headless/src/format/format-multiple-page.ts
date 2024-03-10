import type { PagesResT } from "@headless/types/src/multiple-page.js";

interface DocumentT {
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
	categories: Array<{
		category_id: number;
	}> | null;
	author_id: number | null;
	author_email: string | null;
	author_first_name: string | null;
	author_last_name: string | null;
	author_username: string | null;
}

const formatmultiplePage = (document: DocumentT): PagesResT => {
	const res: PagesResT = {
		id: document.id,
		parent_id: document.parent_id,
		collection_key: document.collection_key,
		title_translations: document.title_translations,
		excerpt_translations: document.excerpt_translations,
		slug: document.slug,
		full_slug: document.full_slug,
		homepage: document.homepage ?? false,
		created_by: document.created_by,
		created_at: document.created_at?.toISOString() || null,
		updated_at: document.updated_at?.toISOString() || null,
		published: document.published ?? false,
		published_at: document.published_at?.toISOString() || null,
		author: null,
		// bricks: []
	};

	if (document.author_id) {
		res.author = {
			id: document.author_id,
			email: document.author_email,
			first_name: document.author_first_name,
			last_name: document.author_last_name,
			username: document.author_username,
		};
	}

	if (document.categories) {
		res.categories = document.categories.map(
			(category) => category.category_id,
		);
	}

	return res;
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
