import type { CollectionResT } from "@headless/types/src/collections.js";
import type { CollectionBuilderT } from "../builders/collection-builder/index.js";

const formatCollection = (
	collectionInstance: CollectionBuilderT,
	bricks: boolean,
): CollectionResT => {
	const collection = collectionInstance.data;
	const key = collectionInstance.key;

	return {
		key: key,
		type: collection.type,
		multiple: collection.multiple,
		title: collection.title,
		singular: collection.singular,
		description: collection.description ?? null,
		slug: collection.slug ?? null,
		disable_homepages: collection.disableHomepages ?? false,
		disable_parents: collection.disableParents ?? false,
		bricks: bricks ? collection.bricks : undefined,
	};
};

export const swaggerCollectionRes = {
	type: "object",
	properties: {
		key: { type: "string", example: "pages" },
		type: { type: "string", example: "builder" },
		multiple: { type: "boolean", example: false },
		slug: { type: "string", example: "pages", nullable: true },
		title: { type: "string", example: "Pages" },
		singular: { type: "string", example: "Page" },
		description: { type: "string", example: "A collection of pages" },
		disable_homepages: { type: "boolean", example: false },
		disable_parents: { type: "boolean", example: false },
		bricks: {
			type: "array",
			items: {
				type: "object",
				properties: {
					key: { type: "string", example: "hero" },
					type: { type: "string", example: "builder" },
					position: { type: "string", example: "top" },
				},
			},
		},
	},
};

export default formatCollection;
