import type { CollectionResT } from "@headless/types/src/collections.js";
import type { CollectionBuilderT } from "../libs/collection-builder/index.js";
import { swaggerBrickConfigsRes } from "./format-brick-config.js";
import { swaggerFieldConfigsRes } from "./format-field-config.js";

const formatCollection = (
	collectionInstance: CollectionBuilderT,
	include?: {
		bricks?: boolean;
		fields?: boolean;
		document_id?: boolean;
	},
	documents?: Array<{
		id?: number;
		collection_key: string;
	}>,
): CollectionResT => {
	const collectionData = collectionInstance.data;
	const key = collectionInstance.key;

	return {
		key: key,
		multiple: collectionData.multiple,
		title: collectionData.title,
		singular: collectionData.singular,
		description: collectionData.description ?? null,
		slug: collectionData.slug ?? null,
		document_id: include?.document_id
			? getDocumentId(key, documents)
			: undefined,
		enable_parents: collectionData.enableParents ?? false,
		enable_homepages: collectionData.enableHomepages ?? false,
		enable_slugs: collectionData.enableSlugs ?? false,
		enable_categories: collectionData.enableCategories ?? false,
		enable_translations: collectionData.enableTranslations ?? false,

		fixed_bricks: include?.bricks
			? collectionInstance.fixedBricks ?? []
			: [],
		builder_bricks: include?.bricks
			? collectionInstance.builderBricks ?? []
			: [],
		fields: include?.fields ? collectionInstance.flatFields ?? [] : [],
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

export const swaggerCollectionRes = {
	type: "object",
	properties: {
		key: { type: "string", example: "pages" },
		multiple: { type: "boolean", example: false },
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
