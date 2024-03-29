import type { CollectionResT } from "@headless/types/src/collections.js";
import type { CollectionBuilderT } from "../libs/builders/collection-builder/index.js";

interface FormatCollectionT {
	collection: CollectionBuilderT;
	include?: {
		bricks?: boolean;
		fields?: boolean;
		document_id?: boolean;
	};
	documents?: Array<{
		id?: number;
		collection_key: string;
	}>;
}

const formatCollection = (props: FormatCollectionT): CollectionResT => {
	const collectionData = props.collection.data;
	const key = props.collection.key;

	return {
		key: key,
		mode: collectionData.mode,
		title: collectionData.title,
		singular: collectionData.singular,
		description: collectionData.description ?? null,
		slug: collectionData.slug ?? null,
		document_id: props.include?.document_id
			? getDocumentId(key, props.documents)
			: undefined,
		enable_parents: collectionData.config.enableParents ?? false,
		enable_homepages: collectionData.config.enableHomepages ?? false,
		enable_slugs: collectionData.config.enableSlugs ?? false,
		enable_categories: collectionData.config.enableCategories ?? false,
		enable_translations: collectionData.config.enableTranslations ?? false,

		fixed_bricks: props.include?.bricks
			? props.collection.fixedBricks ?? []
			: [],
		builder_bricks: props.include?.bricks
			? props.collection.builderBricks ?? []
			: [],
		fields: props.include?.fields ? props.collection.flatFields ?? [] : [],
	};
};

const getDocumentId = (
	collectionKey: string,
	documents?: Array<{
		id?: number;
		collection_key: string;
	}>,
) => {
	const document = documents?.find(
		(document) => document.collection_key === collectionKey,
	);

	return document?.id ?? undefined;
};

const swaggerFieldConfigsRes = {
	type: "object",
	additionalProperties: true,
	properties: {
		type: {
			type: "string",
		},
		title: {
			type: "string",
		},
		key: {
			type: "string",
		},
		description: {
			type: "string",
		},
		fields: {
			type: "array",
			items: {
				type: "object",
				additionalProperties: true,
			},
		},
	},
};

const swaggerBrickConfigsRes = {
	type: "object",
	additionalProperties: true,
	properties: {
		key: {
			type: "string",
		},
		title: {
			type: "string",
		},
		preview: {
			type: "object",
			additionalProperties: true,
			properties: {
				image: {
					type: "string",
				},
			},
		},
		fields: {
			type: "array",
			items: swaggerFieldConfigsRes,
		},
	},
};

export const swaggerCollectionRes = {
	type: "object",
	properties: {
		key: { type: "string", example: "pages" },
		mode: { type: "string", example: "single" },
		title: { type: "string", example: "Pages" },
		singular: { type: "string", example: "Page" },
		description: {
			type: "string",
			example: "A collection of pages",
			nullable: true,
		},
		slug: { type: "string", example: "pages", nullable: true },
		document_id: { type: "number", example: 1, nullable: true },

		enable_parents: { type: "boolean", example: false },
		enable_homepages: { type: "boolean", example: false },
		enable_slugs: { type: "boolean", example: false },
		enable_categories: { type: "boolean", example: false },
		enable_translations: { type: "boolean", example: false },

		fixed_bricks: {
			type: "array",
			items: swaggerBrickConfigsRes,
		},
		builder_bricks: {
			type: "array",
			items: swaggerBrickConfigsRes,
		},
		fields: {
			type: "array",
			items: swaggerFieldConfigsRes,
		},
	},
};

export default formatCollection;
