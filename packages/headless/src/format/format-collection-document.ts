import type { CollectionDocumentResT } from "@headless/types/src/collection-document.js";
import {
	swaggerBrickRes,
	swaggerFieldRes,
	swaggerGroupRes,
} from "./format-bricks.js";
import type { BrickResT, BrickResFieldsT } from "@headless/types/src/bricks.js";
import type { CollectionResT } from "@headless/types/src/collections.js";

interface DocumentT {
	id: number;
	parent_id: number | null;
	collection_key: string | null;
	slug: string | null;
	full_slug: string | null;
	homepage: boolean | null;
	created_by: number | null;
	created_at: Date | null;
	updated_at: Date | null;
	categories: Array<{
		category_id: number;
	}> | null;
	author_id: number | null;
	author_email: string | null;
	author_first_name: string | null;
	author_last_name: string | null;
	author_username: string | null;
}

const formatCollectionDocument = (
	page: DocumentT,
	collection?: CollectionResT,
	bricks?: BrickResT[],
	fields?: BrickResFieldsT[] | null,
): CollectionDocumentResT => {
	const res: CollectionDocumentResT = {
		id: page.id,
		parent_id: page.parent_id,
		collection_key: page.collection_key,
		slug: page.slug,
		full_slug: formatPageFullSlug(page.full_slug, collection?.slug),
		collection_slug: collection?.slug ?? null,
		homepage: page.homepage ?? false,
		bricks: bricks || [],
		fields: fields || null,
		created_by: page.created_by,
		created_at: page.created_at?.toISOString() || null,
		updated_at: page.updated_at?.toISOString() || null,
		author: null,
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

export const formatPageFullSlug = (
	full_slug: string | null,
	collection_slug?: string | null,
) => {
	let slug = null;

	if (!full_slug) return slug;
	if (collection_slug !== null) slug = [collection_slug, full_slug].join("/");
	else slug = full_slug;

	if (!slug.startsWith("/")) return `/${slug}`;
	return slug;
};

export const swaggerCollectionDocumentResT = {
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
		collection_slug: {
			type: "string",
			nullable: true,
		},
		homepage: {
			type: "boolean",
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
		bricks: {
			type: "array",
			items: swaggerBrickRes,
		},
		fields: {
			type: "array",
			nullable: true,
			items: swaggerFieldRes,
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

export default formatCollectionDocument;
