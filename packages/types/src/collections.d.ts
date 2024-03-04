export interface CollectionResT {
	key: string;
	type: "single-builder" | "multiple-builder";
	title: string;
	singular: string;
	description: string | null;
	bricks: CollectionBrickConfigT[];
}
export interface CollectionBrickConfigT {
	key: string;
	type: "builder" | "fixed";
	position: "top" | "bottom" | "sidebar";
}

export interface CollectionCategoriesResT {
	id: number;
	environment_key: string;
	collection_key: string;
	title: string;
	slug: string;
	description: string | null;
	created_at: string;
	updated_at: string;
}
