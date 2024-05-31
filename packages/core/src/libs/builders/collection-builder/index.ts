import z from "zod";
import FieldBuilder from "../field-builder/index.js";
import type BrickBuilder from "../brick-builder/index.js";
import type {
	FieldTypes,
	CustomFieldPropsT,
} from "../../custom-fields/types.js";
import type CustomFieldConfig from "../../custom-fields/cf-config.js";
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
	addText(
		key: string,
		props?: CustomFieldPropsT<"text">,
		collection?: FieldCollectionConfig,
	) {
		this.#fieldCollectionHelper(key, "text", collection);
		super.addText(key, props);
		return this;
	}
	addNumber(
		key: string,
		props?: CustomFieldPropsT<"number">,
		collection?: FieldCollectionConfig,
	) {
		this.#fieldCollectionHelper(key, "number", collection);
		super.addNumber(key, props);
		return this;
	}
	addCheckbox(
		key: string,
		props?: CustomFieldPropsT<"checkbox">,
		collection?: FieldCollectionConfig,
	) {
		this.#fieldCollectionHelper(key, "checkbox", collection);
		super.addCheckbox(key, props);
		return this;
	}
	addSelect(
		key: string,
		props?: CustomFieldPropsT<"select">,
		collection?: FieldCollectionConfig,
	) {
		this.#fieldCollectionHelper(key, "select", collection);
		super.addSelect(key, props);
		return this;
	}
	addTextarea(
		key: string,
		props?: CustomFieldPropsT<"textarea">,
		collection?: FieldCollectionConfig,
	) {
		this.#fieldCollectionHelper(key, "textarea", collection);
		super.addTextarea(key, props);
		return this;
	}
	addDateTime(
		key: string,
		props?: CustomFieldPropsT<"datetime">,
		collection?: FieldCollectionConfig,
	) {
		this.#fieldCollectionHelper(key, "datetime", collection);
		super.addDateTime(key, props);
		return this;
	}
	addUser(
		key: string,
		props?: CustomFieldPropsT<"user">,
		collection?: FieldCollectionConfig,
	) {
		this.#fieldCollectionHelper(key, "user", collection);
		super.addUser(key, props);
		return this;
	}
	addMedia(
		key: string,
		props?: CustomFieldPropsT<"media">,
		collection?: FieldCollectionConfig,
	) {
		this.#fieldCollectionHelper(key, "media", collection);
		super.addMedia(key, props);
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
	// TODO: this can be a getter and tallied up
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
	get fixedBricks(): CollectionBrickConfig[] {
		return (
			this.config.bricks?.fixed?.map((brick) => ({
				key: brick.key,
				title: brick.config.title,
				description: brick.config.description,
				preview: brick.config.preview,
				fields: brick.fieldTree,
			})) ?? []
		);
	}
	get builderBricks(): CollectionBrickConfig[] {
		return (
			this.config.bricks?.builder?.map((brick) => ({
				key: brick.key,
				title: brick.config.title,
				description: brick.config.description,
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

export interface FieldCollectionConfig {
	list?: true;
	filterable?: true;
}

export interface CollectionConfigSchemaT
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

export interface CollectionBrickConfig {
	key: BrickBuilder["key"];
	title: BrickBuilder["config"]["title"];
	description: BrickBuilder["config"]["description"];
	preview: BrickBuilder["config"]["preview"];
	fields: CustomFieldConfig<FieldTypes>[];
}
