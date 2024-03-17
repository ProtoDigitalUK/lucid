import type { CollectionResT } from "@headless/types/src/collections.js";
import { type BrickBuilderT } from "../builders/brick-builder/index.js";

const formatCollection = (
	collection: {
		created_at: Date | null;
		description: string | null;
		key: string;
		singular: string;
		slug: string | null;
		title: string;
		type: "single-page" | "multiple-page";
		updated_at: Date | null;
		disable_homepages: boolean | null;
		disable_parents: boolean | null;
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
		slug: collection.slug,
		title: collection.title,
		type: collection.type,
		disable_homepages: collection.disable_homepages,
		disable_parents: collection.disable_parents,
		bricks: bricks,
	};
};

export const swaggerCollectionRes = {
	type: "object",
	properties: {
		key: { type: "string", example: "pages" },
		type: { type: "string", example: "multiple-page" },
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
