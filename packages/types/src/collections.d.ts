import {
	type CollectionDataT,
	type CollectionBrickConfigT,
} from "../../headless/src/libs/builders/collection-builder/index.js";
import { CustomFieldT } from "../../headless/src/libs/builders/field-builder/types.js";

export interface CollectionResT {
	key: string;
	mode: "single" | "multiple";
	title: string;
	singular: string;
	description: string | null;
	document_id?: number | null;
	translations: boolean;
	fixed_bricks: Array<CollectionBrickConfigT>;
	builder_bricks: Array<CollectionBrickConfigT>;
	fields: Array<CustomFieldT>;
}

// biome-ignore lint/suspicious/noRedeclare: <explanation>
export type CollectionBrickConfigT = CollectionBrickConfigT;
