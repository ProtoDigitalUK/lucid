import type { CollectionResT } from "@headless/types/src/collections.js";
import { type BrickBuilderT } from "../builders/brick-builder/index.js";

const formatCollection = (
	collection: {
		created_at: Date | null;
		description: string | null;
		key: string;
		singular: string;
		title: string;
		type: "single-builder" | "multiple-builder";
		updated_at: Date | null;
		bricks?: {
			key: string;
			position: "top" | "bottom" | "sidebar";
			type: "builder" | "fixed";
		}[];
	},
	brickInstances: BrickBuilderT[] | undefined,
): CollectionResT => {
	const bricks = collection.bricks
		?.filter((brick) => brickInstances?.find((b) => b.key === brick.key))
		.map((brick) => ({
			key: brick.key,
			position: brick.position,
			type: brick.type,
		}));

	return {
		description: collection.description,
		key: collection.key,
		singular: collection.singular,
		title: collection.title,
		type: collection.type,
		bricks: bricks,
	};
};

export const swaggerCollectionRes = {
	type: "object",
	properties: {
		key: { type: "string", example: "pages" },
		type: { type: "string", example: "multiple-builder" },
		title: { type: "string", example: "Pages" },
		singular: { type: "string", example: "Page" },
		description: { type: "string", example: "A collection of pages" },
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
