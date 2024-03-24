import type {
	TextConfigT,
	NumberConfigT,
	CheckboxConfigT,
	SelectConfigT,
	TextareaConfigT,
	DateTimeConfigT,
} from "../field-builder/index.js";

export interface FieldCollectionConfigT {
	list?: true;
	filterable?: true;
}

export interface CollectionTextConfigT extends TextConfigT {
	collection?: FieldCollectionConfigT;
}
export interface CollectionNumberConfigT extends NumberConfigT {
	collection?: FieldCollectionConfigT;
}
export interface CollectionCheckboxConfigT extends CheckboxConfigT {
	collection?: FieldCollectionConfigT;
}
export interface CollectionSelectConfigT extends SelectConfigT {
	collection?: FieldCollectionConfigT;
}
export interface CollectionTextareaConfigT extends TextareaConfigT {
	collection?: FieldCollectionConfigT;
}
export interface CollectionDateTimeConfigT extends DateTimeConfigT {
	collection?: FieldCollectionConfigT;
}
