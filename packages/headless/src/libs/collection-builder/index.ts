import z from "zod";
import FieldBuilder, { type CustomFieldT } from "../field-builder/index.js";
import type { BrickBuilderT } from "../brick-builder/index.js";
import type {
	CollectionTextConfigT,
	FieldCollectionConfigT,
	CollectionNumberConfigT,
	CollectionCheckboxConfigT,
	CollectionSelectConfigT,
	CollectionTextareaConfigT,
	CollectionDateTimeConfigT,
} from "./types.js";

export default class CollectionBuilder extends FieldBuilder {
	key: string;
	config: CollectionConfigT;
	includeFieldKeys: string[] = [];
	filterableFieldKeys: string[] = [];
	constructor(key: string, config: CollectionConfigT) {
		super();
		this.key = key;
		this.config = config;

		if (this.config.bricks?.fixed) {
			this.config.bricks.fixed = this.#removeDuplicateBricks(
				config.bricks?.fixed,
			);
		}
		if (this.config.bricks?.builder) {
			this.config.bricks.builder = this.#removeDuplicateBricks(
				config.bricks?.builder,
			);
		}
	}
	// ------------------------------------
	// Builder Methods
	addText(config: CollectionTextConfigT) {
		this.#fieldCollectionHelper(config.key, config.collection);
		super.addText(config);
		return this;
	}
	addNumber(config: CollectionNumberConfigT) {
		this.#fieldCollectionHelper(config.key, config.collection);
		super.addNumber(config);
		return this;
	}
	addCheckbox(config: CollectionCheckboxConfigT) {
		this.#fieldCollectionHelper(config.key, config.collection);
		super.addCheckbox(config);
		return this;
	}
	addSelect(config: CollectionSelectConfigT) {
		this.#fieldCollectionHelper(config.key, config.collection);
		super.addSelect(config);
		return this;
	}
	addTextarea(config: CollectionTextareaConfigT) {
		this.#fieldCollectionHelper(config.key, config.collection);
		super.addTextarea(config);
		return this;
	}
	addDateTime(config: CollectionDateTimeConfigT) {
		this.#fieldCollectionHelper(config.key, config.collection);
		super.addDateTime(config);
		return this;
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
	#fieldCollectionHelper = (key: string, config?: FieldCollectionConfigT) => {
		if (config?.list) this.includeFieldKeys.push(key);
		if (config?.filterable) this.filterableFieldKeys.push(key);
	};
	// ------------------------------------
	// Getters
	get data(): CollectionDataT {
		return {
			key: this.key,
			mode: this.config.mode,
			title: this.config.title,
			singular: this.config.singular,
			description: this.config.description ?? null,
			slug: this.config.slug ?? null,
			config: {
				enableParents: this.config.config?.enableParents ?? false,
				enableHomepages: this.config.config?.enableHomepages ?? false,
				enableSlugs: this.config.config?.enableSlugs ?? false,
				enableCategories: this.config.config?.enableCategories ?? false,
				enableTranslations:
					this.config.config?.enableTranslations ?? false,
			},
		};
	}
	get fixedBricks(): Array<CollectionBrickConfigT> {
		return (
			this.config.bricks?.fixed?.map((brick) => ({
				key: brick.key,
				title: brick.config.title,
				preview: brick.config.preview,
				fields: brick.fieldTree,
			})) ?? []
		);
	}
	get builderBricks(): Array<CollectionBrickConfigT> {
		return (
			this.config.bricks?.builder?.map((brick) => ({
				key: brick.key,
				title: brick.config.title,
				preview: brick.config.preview,
				fields: brick.fieldTree,
			})) ?? []
		);
	}
}

export const CollectionConfigSchema = z.object({
	mode: z.enum(["single", "multiple"]),

	title: z.string(),
	singular: z.string(),
	description: z.string().optional(),
	slug: z.string().optional(),

	config: z
		.object({
			enableParents: z.boolean().default(false).optional(),
			enableHomepages: z.boolean().default(false).optional(),
			enableSlugs: z.boolean().default(false).optional(),
			enableCategories: z.boolean().default(false).optional(),
			enableTranslations: z.boolean().default(false).optional(),
		})
		.optional(),
	bricks: z
		.object({
			fixed: z.array(z.unknown()).optional(),
			builder: z.array(z.unknown()).optional(),
		})
		.optional(),
});

interface CollectionConfigT extends z.infer<typeof CollectionConfigSchema> {
	bricks?: {
		fixed?: Array<BrickBuilderT>;
		builder?: Array<BrickBuilderT>;
	};
}

export type CollectionDataT = {
	key: string;
	mode: CollectionConfigT["mode"];
	title: CollectionConfigT["title"];
	singular: CollectionConfigT["singular"];
	description: string | null;
	slug: string | null;
	config: {
		enableParents: boolean;
		enableHomepages: boolean;
		enableSlugs: boolean;
		enableCategories: boolean;
		enableTranslations: boolean;
	};
};

export interface CollectionBrickConfigT {
	key: BrickBuilderT["key"];
	title: BrickBuilderT["config"]["title"];
	preview: BrickBuilderT["config"]["preview"];
	fields: CustomFieldT[];
}

export type CollectionBuilderT = InstanceType<typeof CollectionBuilder>;
