import z from "zod";
import FieldBuilder, {
	type FieldTypes,
	type CustomField,
} from "../field-builder/index.js";
import type BrickBuilder from "../brick-builder/index.js";
import type {
	CollectionTextConfig,
	FieldCollectionConfig,
	CollectionNumberConfig,
	CollectionCheckboxConfig,
	CollectionSelectConfig,
	CollectionTextareaConfig,
	CollectionDateTimeConfig,
	CollectionUserConfig,
	CollectionMediaConfig,
} from "./types.js";
import type { CollectionDocumentBuilderHooks } from "../../../types/hooks.js";

export default class CollectionBuilder extends FieldBuilder {
	key: string;
	config: CollectionConfigSchemaT;
	includeFieldKeys: string[] = [];
	filterableFieldKeys: FieldFilters = [];
	constructor(key: string, config: CollectionConfigSchemaT) {
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
	addText(config: CollectionTextConfig) {
		this.#fieldCollectionHelper(config.key, "text", config.collection);
		super.addText(config);
		return this;
	}
	addNumber(config: CollectionNumberConfig) {
		this.#fieldCollectionHelper(config.key, "number", config.collection);
		super.addNumber(config);
		return this;
	}
	addCheckbox(config: CollectionCheckboxConfig) {
		this.#fieldCollectionHelper(config.key, "checkbox", config.collection);
		super.addCheckbox(config);
		return this;
	}
	addSelect(config: CollectionSelectConfig) {
		this.#fieldCollectionHelper(config.key, "select", config.collection);
		super.addSelect(config);
		return this;
	}
	addTextarea(config: CollectionTextareaConfig) {
		this.#fieldCollectionHelper(config.key, "textarea", config.collection);
		super.addTextarea(config);
		return this;
	}
	addDateTime(config: CollectionDateTimeConfig) {
		this.#fieldCollectionHelper(config.key, "datetime", config.collection);
		super.addDateTime(config);
		return this;
	}
	addUser(config: CollectionUserConfig) {
		this.#fieldCollectionHelper(config.key, "user", config.collection);
		super.addUser(config);
		return this;
	}
	addMedia(config: CollectionMediaConfig) {
		this.#fieldCollectionHelper(config.key, "media", config.collection);
		super.addMedia(config);
		return this;
	}
	// ------------------------------------
	// Private Methods
	#removeDuplicateBricks = (bricks?: Array<BrickBuilder>) => {
		if (!bricks) return undefined;

		return bricks.filter(
			(brick, index) =>
				bricks.findIndex((b) => b.key === brick.key) === index,
		);
	};
	#fieldCollectionHelper = (
		key: string,
		type: FieldTypes,
		config?: FieldCollectionConfig,
	) => {
		if (config?.list) this.includeFieldKeys.push(key);
		if (config?.filterable)
			this.filterableFieldKeys.push({
				key,
				type,
			});
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
			locked: this.config.locked ?? false,
			config: {
				translations: this.config?.translations ?? false,
				fields: {
					filter: this.filterableFieldKeys,
					include: this.includeFieldKeys,
				},
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
	get brickInstances(): Array<BrickBuilder> {
		return [
			...(this.config.bricks?.builder || []),
			...(this.config.bricks?.fixed || []),
		];
	}
}

export const CollectionConfigSchema = z.object({
	mode: z.enum(["single", "multiple"]),

	title: z.string(),
	singular: z.string(),
	description: z.string().optional(),
	translations: z.boolean().default(false).optional(),
	locked: z.boolean().default(false).optional(),
	hooks: z
		.array(
			z.object({
				event: z.string(),
				handler: z.unknown(),
			}),
		)
		.optional(),
	bricks: z
		.object({
			fixed: z.array(z.unknown()).optional(),
			builder: z.array(z.unknown()).optional(),
		})
		.optional(),
});

interface CollectionConfigSchemaT
	extends z.infer<typeof CollectionConfigSchema> {
	hooks?: CollectionDocumentBuilderHooks[];
	bricks?: {
		fixed?: Array<BrickBuilder>;
		builder?: Array<BrickBuilder>;
	};
}

export type CollectionDataT = {
	key: string;
	mode: CollectionConfigSchemaT["mode"];
	title: CollectionConfigSchemaT["title"];
	singular: CollectionConfigSchemaT["singular"];
	description: string | null;
	locked: boolean;
	config: {
		translations: boolean;
		fields: {
			filter: FieldFilters;
			include: string[];
		};
	};
};

export type FieldFilters = Array<{
	key: string;
	type: FieldTypes;
}>;

export interface CollectionBrickConfigT {
	key: BrickBuilder["key"];
	title: BrickBuilder["config"]["title"];
	preview: BrickBuilder["config"]["preview"];
	fields: CustomField[];
}
