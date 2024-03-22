import {
	type CollectionDataT,
	type CollectionBrickConfigT,
} from "../../headless/src/builders/collection-builder/index.js";

export interface CollectionResT {
	key: string;
	type: CollectionDataT["type"];
	multiple: CollectionDataT["multiple"];
	slug: string | null;
	title: string;
	singular: string;
	description: string | null;
	disable_homepages: boolean | null;
	disable_parents: boolean | null;
	bricks?: CollectionBrickConfigT[];
}

// biome-ignore lint/suspicious/noRedeclare: <explanation>
export type CollectionBrickConfigT = CollectionBrickConfigT;
