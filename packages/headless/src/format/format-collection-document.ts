import type { CollectionDocumentResT } from "@headless/types/src/collection-document.js";
import type { BrickResT, FieldResT } from "@headless/types/src/bricks.js";
import type { CollectionBuilderT } from "../libs/collection-builder/index.js";
import type { BooleanInt } from "../libs/db/types.js";
import { swaggerBrickRes } from "./format-collection-bricks.js";
import formatCollectionFields, {
	type FieldQueryDataT,
	swaggerFieldRes,
} from "./format-collection-fields.js";
import { formatDate } from "../utils/format-helpers.js";

interface DocumentQueryDataT {
	id: number;
	parent_id: number | null;
	collection_key: string | null;
	slug: string | null;
	full_slug: string | null;
	homepage: BooleanInt | null;
	created_by: number | null;
	created_at: Date | string | null;
	updated_at: Date | string | null;
	categories: Array<{
		category_id: number;
	}> | null;
	author_id: number | null;
	author_email: string | null;
	author_first_name: string | null;
	author_last_name: string | null;
	author_username: string | null;
	fields?: FieldQueryDataT[];
}

interface FormatCollectionDocumentT {
	document: DocumentQueryDataT;
	collection: CollectionBuilderT;
	bricks?: BrickResT[];
	fields?: FieldResT[] | null;
	host: string;
}

const formatCollectionDocument = (
	props: FormatCollectionDocumentT,
): CollectionDocumentResT => {
	const collectionData = props.collection?.data;

	let fields: FieldResT[] | null = null;
	if (props.fields) {
		fields = props.fields;
	} else if (props.document.fields) {
		fields = formatCollectionFields({
			fields: props.document.fields,
			host: props.host,
			collection_slug: collectionData?.slug,
			builder: props.collection,
		});
	}

	const res: CollectionDocumentResT = {
		id: props.document.id,
		parent_id: props.document.parent_id,
		collection_key: props.document.collection_key,
		slug: props.document.slug,
		full_slug: formatDocumentFullSlug(
			props.document.full_slug,
			collectionData?.slug,
		),
		collection_slug: collectionData?.slug ?? null,
		homepage: props.document.homepage ?? 0,
		bricks: props.bricks || [],
		fields: fields,
		created_by: props.document.created_by,
		created_at: formatDate(props.document.created_at),
		updated_at: formatDate(props.document.updated_at),
		author: null,
	};

	if (props.document.author_id) {
		res.author = {
			id: props.document.author_id,
			email: props.document.author_email,
			first_name: props.document.author_first_name,
			last_name: props.document.author_last_name,
			username: props.document.author_username,
		};
	}

	if (props.document.categories) {
		res.categories = props.document.categories.map(
			(category) => category.category_id,
		);
	}

	return res;
};

export const formatDocumentFullSlug = (
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
			type: "number",
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
