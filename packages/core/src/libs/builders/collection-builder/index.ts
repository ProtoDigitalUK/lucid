import FieldBuilder from "../field-builder/index.js";
import type BrickBuilder from "../brick-builder/index.js";
import type { FieldTypes, CFProps } from "../../custom-fields/types.js";
import type { RequestQueryParsed } from "../../../middleware/validate-query.js";
import type {
	FieldCollectionConfig,
	CollectionConfigSchemaType,
	CollectionData,
	DocumentFiltersResponse,
	CollectionBrickConfig,
	FieldFilters,
} from "./types.js";

class CollectionBuilder extends FieldBuilder {
	key: string;
	config: CollectionConfigSchemaType;
	includeFieldKeys: string[] = [];
	filterableFieldKeys: FieldFilters = [];
	constructor(key: string, config: CollectionConfigSchemaType) {
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
		props?: CFProps<"text">,
		collection?: FieldCollectionConfig,
	) {
		this.#fieldCollectionHelper(key, "text", collection);
		super.addText(key, props);
		return this;
	}
	addNumber(
		key: string,
		props?: CFProps<"number">,
		collection?: FieldCollectionConfig,
	) {
		this.#fieldCollectionHelper(key, "number", collection);
		super.addNumber(key, props);
		return this;
	}
	addCheckbox(
		key: string,
		props?: CFProps<"checkbox">,
		collection?: FieldCollectionConfig,
	) {
		this.#fieldCollectionHelper(key, "checkbox", collection);
		super.addCheckbox(key, props);
		return this;
	}
	addSelect(
		key: string,
		props?: CFProps<"select">,
		collection?: FieldCollectionConfig,
	) {
		this.#fieldCollectionHelper(key, "select", collection);
		super.addSelect(key, props);
		return this;
	}
	addTextarea(
		key: string,
		props?: CFProps<"textarea">,
		collection?: FieldCollectionConfig,
	) {
		this.#fieldCollectionHelper(key, "textarea", collection);
		super.addTextarea(key, props);
		return this;
	}
	addDateTime(
		key: string,
		props?: CFProps<"datetime">,
		collection?: FieldCollectionConfig,
	) {
		this.#fieldCollectionHelper(key, "datetime", collection);
		super.addDateTime(key, props);
		return this;
	}
	addUser(
		key: string,
		props?: CFProps<"user">,
		collection?: FieldCollectionConfig,
	) {
		this.#fieldCollectionHelper(key, "user", collection);
		super.addUser(key, props);
		return this;
	}
	addMedia(
		key: string,
		props?: CFProps<"media">,
		collection?: FieldCollectionConfig,
	) {
		this.#fieldCollectionHelper(key, "media", collection);
		super.addMedia(key, props);
		return this;
	}
	// ------------------------------------
	// Public Methods
	documentFilters(
		filters: RequestQueryParsed["filter"],
	): DocumentFiltersResponse[] {
		if (!filters) return [];

		return this.filterableFieldKeys.reduce<DocumentFiltersResponse[]>(
			(acc, field) => {
				const filterValue = filters[field.key];
				if (filterValue === undefined) return acc;

				const fieldInstance = this.fields.get(field.key);
				if (!fieldInstance) return acc;

				acc.push({
					key: field.key,
					value: filterValue.value,
					operator: filterValue.operator ?? "=",
					column: fieldInstance.column,
				});

				return acc;
			},
			[],
		);
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
	get data(): CollectionData {
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

export default CollectionBuilder;
