import type { CollectionDocumentResT } from "@headless/types/src/collection-document.js";
import { swaggerBrickRes, swaggerFieldRes } from "./format-bricks.js";
import type { BrickResT, BrickResFieldsT } from "@headless/types/src/bricks.js";
import type { CollectionBuilderT } from "../libs/collection-builder/index.js";

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
	// fields?: BrickQueryFieldT[];
	// {
	// 	text_value: string | null;
	// 	int_value: number | null;
	// 	bool_value: boolean | null;
	// 	language_id: number | null;
	// 	type: string;
	// 	key: string;
	// }>;
}

const formatCollectionDocument = (
	document: DocumentT,
	collection?: CollectionBuilderT,
	bricks?: BrickResT[],
	fields?: BrickResFieldsT[] | null,
): CollectionDocumentResT => {
	const collectionData = collection?.data;

	const res: CollectionDocumentResT = {
		id: document.id,
		parent_id: document.parent_id,
		collection_key: document.collection_key,
		slug: document.slug,
		full_slug: formatPageFullSlug(document.full_slug, collectionData?.slug),
		collection_slug: collectionData?.slug ?? null,
		homepage: document.homepage ?? false,
		bricks: bricks || [],
		fields: fields || null,
		created_by: document.created_by,
		created_at: document.created_at?.toISOString() || null,
		updated_at: document.updated_at?.toISOString() || null,
		author: null,
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
	},
};

export default formatCollectionDocument;
