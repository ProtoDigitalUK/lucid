import z from "zod";
import FieldBuilder from "../field-builder/index.js";
import type { BrickBuilderT } from "../brick-builder/index.js";

export default class CollectionBuilder extends FieldBuilder {
	key: string;
	config: CollectionConfigT;
	constructor(key: string, config: CollectionConfigT) {
		super();
		this.key = key;
		this.config = config;

		this.config.fixedBricks = this.#removeDuplicateBricks(
			config.fixedBricks,
		);
		this.config.builderBricks = this.#removeDuplicateBricks(
			config.builderBricks,
		);
	}
	// ------------------------------------
	// Private Methods
	#removeDuplicateBricks = (bricks?: Array<BrickBuilderT>) => {
		if (!bricks) return undefined;

		return bricks.filter(
			(brick, index) =>
				bricks.findIndex((b) => b.key === brick.key) === index,
		);
	};
	// ------------------------------------
	// Getters
	get data(): CollectionDataT {
		return {
			key: this.key,
			multiple: this.config.multiple,
			title: this.config.title,
			singular: this.config.singular,
			description: this.config.description,
			slug: this.config.slug,
			enableParents: this.config.enableParents,
			enableHomepages: this.config.enableHomepages,
			enableSlugs: this.config.enableSlugs,
			enableCategories: this.config.enableCategories,
			fixedBricks: this.config.fixedBricks,
			builderBricks: this.config.builderBricks,
		};
	}
}

export const CollectionConfigSchema = z.object({
	// type: z.enum(["builder"]), will be inferred on FE if collection has bricks assigned
	multiple: z.boolean().default(false),
	title: z.string(),
	singular: z.string(),
	description: z.string().optional(),
	slug: z.string().optional(),

	enableParents: z.boolean().default(false).optional(),
	enableHomepages: z.boolean().default(false).optional(),
	enableSlugs: z.boolean().default(false).optional(),
	enableCategories: z.boolean().default(false).optional(),

	fixedBricks: z.array(z.unknown()).optional(),
	builderBricks: z.array(z.unknown()).optional(),
});

interface CollectionConfigT extends z.infer<typeof CollectionConfigSchema> {
	fixedBricks?: Array<BrickBuilderT>;
	builderBricks?: Array<BrickBuilderT>;
}

export type CollectionDataT = {
	key: string;
	multiple: CollectionConfigT["multiple"];
	title: CollectionConfigT["title"];
	singular: CollectionConfigT["singular"];
	description: CollectionConfigT["description"];
	slug: CollectionConfigT["slug"];
	enableParents: CollectionConfigT["enableParents"];
	enableHomepages: CollectionConfigT["enableHomepages"];
	enableSlugs: CollectionConfigT["enableSlugs"];
	enableCategories: CollectionConfigT["enableCategories"];
	fixedBricks?: Array<BrickBuilderT>;
	builderBricks?: Array<BrickBuilderT>;
};

export type CollectionBuilderT = InstanceType<typeof CollectionBuilder>;
