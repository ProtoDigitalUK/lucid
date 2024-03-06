export interface CollectionResT {
	key: string;
	type: "single-builder" | "multiple-builder";
	title: string;
	singular: string;
	description: string | null;
	disable_homepages: boolean | null;
	disable_parents: boolean | null;
	bricks?: CollectionBrickConfigT[];
}
export interface CollectionBrickConfigT {
	key: string;
	type: "builder" | "fixed";
	position: "top" | "bottom" | "sidebar";
}
