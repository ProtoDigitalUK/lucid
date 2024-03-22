import z from "zod";
import type { BrickBuilderT } from "../brick-builder/index.js";

export default class CollectionBuilder {
	key: string;
	config: CollectionConfigT;
	constructor(key: string, config: CollectionConfigT) {
		this.key = key;
		this.config = config;

		this.#removeDuplicateBricks();
		this.#addBrickDefaults();
	}
	// ------------------------------------
	// Private Methods
	#removeDuplicateBricks = () => {
		if (!this.config.bricks) return;
		const bricks = this.config.bricks;

		const builderBricks = bricks.filter(
			(brick) => brick.type === "builder",
		);
		const fixedBricks = bricks.filter((brick) => brick.type === "fixed");

		// Remove duplicate builder bricks
		const uniqueBuilderBricks = builderBricks.filter(
			(brick, index) =>
				builderBricks.findIndex(
					(b) => b.brick.key === brick.brick.key,
				) === index,
		);

		// Remove duplicate fixed bricks
		const uniqueFixedBricks = fixedBricks.filter(
			(brick, index) =>
				fixedBricks.findIndex(
					(b) =>
						b.brick.key === brick.brick.key &&
						b.position === brick.position,
				) === index,
		);
		this.config.bricks = [...uniqueBuilderBricks, ...uniqueFixedBricks];
	};
	#addBrickDefaults = () => {
		if (!this.config.bricks) return;
		// add default position to fixed bricks
		this.config.bricks = this.config.bricks.map((brick) => {
			if (brick.type === "fixed" && !brick.position) {
				brick.position = "bottom";
			}
			return brick;
		});
	};
	// ------------------------------------
	// Getters
	get data(): CollectionDataT {
		return {
			key: this.key,
			type: this.config.type,
			multiple: this.config.multiple,
			title: this.config.title,
			singular: this.config.singular,
			description: this.config.description,
			slug: this.config.slug,
			disableParents: this.config.disableParents,
			disableHomepages: this.config.disableHomepages,
			bricks: this.config.bricks?.map((brick) => ({
				key: brick.brick.key,
				type: brick.type,
				position: brick.position,
			})),
		};
	}
}

export const CollectionConfigSchema = z.object({
	type: z.enum(["builder"]),
	multiple: z.boolean().default(false),
	title: z.string(),
	singular: z.string(),
	description: z.string().optional(),
	slug: z.string().optional(),
	disableParents: z.boolean().default(false).optional(),
	disableHomepages: z.boolean().default(false).optional(),
	bricks: z
		.array(
			z.object({
				brick: z.unknown(),
				type: z.enum(["builder", "fixed"]),
				position: z.enum(["bottom", "top", "sidebar"]).optional(),
			}),
		)
		.optional(),
});

interface CollectionConfigT extends z.infer<typeof CollectionConfigSchema> {
	bricks?: {
		brick: BrickBuilderT;
		type: "builder" | "fixed";
		position?: "bottom" | "top" | "sidebar";
	}[];
}

export type CollectionDataT = {
	key: string;
	type: CollectionConfigT["type"];
	multiple: CollectionConfigT["multiple"];
	title: CollectionConfigT["title"];
	singular: CollectionConfigT["singular"];
	description: CollectionConfigT["description"];
	slug: CollectionConfigT["slug"];
	disableParents: CollectionConfigT["disableParents"];
	disableHomepages: CollectionConfigT["disableHomepages"];
	bricks?: Array<CollectionBrickConfigT>;
};

export type CollectionBrickConfigT = {
	key: string;
	type: "builder" | "fixed";
	position?: "bottom" | "top" | "sidebar";
};

export type CollectionBuilderT = InstanceType<typeof CollectionBuilder>;
