import {
	type CollectionDataT,
	type CollectionBrickConfigT,
} from "../../headless/src/libs/collection-builder/index.js";
import { CustomFieldT } from "../../headless/src/libs/field-builder/types.js";

export interface CollectionResT {
	key: string;
	multiple: boolean;
	title: string;
	singular: string;
	description: string | null;
	slug: string | null;
	enable_parents: boolean;
	enable_homepages: boolean;
	enable_slugs: boolean;
	enable_categories: boolean;
	enable_translations: boolean;
	fixed_bricks: Array<CollectionBrickConfigT>;
	builder_bricks: Array<CollectionBrickConfigT>;
	fields: Array<CustomFieldT>;
}

// biome-ignore lint/suspicious/noRedeclare: <explanation>
export type CollectionBrickConfigT = CollectionBrickConfigT;
