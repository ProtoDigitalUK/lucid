import type {
	TextConfig,
	NumberConfig,
	CheckboxConfig,
	SelectConfig,
	TextareaConfig,
	DateTimeConfig,
	UserConfig,
	MediaConfig,
} from "../field-builder/index.js";

export interface FieldCollectionConfig {
	list?: true;
	filterable?: true;
}

export interface CollectionTextConfig extends TextConfig {
	collection?: FieldCollectionConfig;
}
export interface CollectionNumberConfig extends NumberConfig {
	collection?: FieldCollectionConfig;
}
export interface CollectionCheckboxConfig extends CheckboxConfig {
	collection?: FieldCollectionConfig;
}
export interface CollectionSelectConfig extends SelectConfig {
	collection?: FieldCollectionConfig;
}
export interface CollectionTextareaConfig extends TextareaConfig {
	collection?: FieldCollectionConfig;
}
export interface CollectionDateTimeConfig extends DateTimeConfig {
	collection?: FieldCollectionConfig;
}

export interface CollectionUserConfig extends UserConfig {
	collection?: FieldCollectionConfig;
}

export interface CollectionMediaConfig extends MediaConfig {
	collection?: FieldCollectionConfig;
}
