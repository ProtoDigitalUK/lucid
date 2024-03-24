import z from "zod";
import FieldBuilder, { type CustomFieldT } from "../field-builder/index.js";
import type { BrickBuilderT } from "../brick-builder/index.js";

export default class CollectionBuilder extends FieldBuilder {
	key: string;
	config: CollectionConfigT;
	enabledParents = false;
	enabledHomepages = false;
	enabledSlugs = false;
	enabledCategories = false;
	enabledTranslations = false;
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
	// Builder Methods
	enableParents = () => {
		this.enabledParents = true;
		return this;
	};
	enableHomepages = () => {
		this.enabledHomepages = true;
		return this;
	};
	enableSlugs = () => {
		this.enabledSlugs = true;
		return this;
	};
	enableCategories = () => {
		this.enabledCategories = true;
		return this;
	};
	enableTranslations = () => {
		this.enabledTranslations = true;
		return this;
	};
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
			description: this.config.description ?? null,
			slug: this.config.slug ?? null,
			enableParents: this.enabledParents,
			enableHomepages: this.enabledHomepages,
			enableSlugs: this.enabledSlugs,
			enableCategories: this.enabledCategories,
			enableTranslations: this.enabledTranslations,
		};
	}
	get fixedBricks(): Array<CollectionBrickConfigT> {
		return (
			this.config.fixedBricks?.map((brick) => ({
				key: brick.key,
				title: brick.config.title,
				preview: brick.config.preview,
				fields: brick.fieldTree,
			})) ?? []
		);
	}
	get builderBricks(): Array<CollectionBrickConfigT> {
		return (
			this.config.builderBricks?.map((brick) => ({
				key: brick.key,
				title: brick.config.title,
				preview: brick.config.preview,
				fields: brick.fieldTree,
			})) ?? []
		);
	}
}

export const CollectionConfigSchema = z.object({
	multiple: z.boolean().default(false),
	title: z.string(),
	singular: z.string(),
	description: z.string().optional(),
	slug: z.string().optional(),

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
	description: string | null;
	slug: string | null;
	enableParents: boolean;
	enableHomepages: boolean;
	enableSlugs: boolean;
	enableCategories: boolean;
	enableTranslations: boolean;
};

export interface CollectionBrickConfigT {
	key: BrickBuilderT["key"];
	title: BrickBuilderT["config"]["title"];
	preview: BrickBuilderT["config"]["preview"];
	fields: CustomFieldT[];
}

export type CollectionBuilderT = InstanceType<typeof CollectionBuilder>;
