// Internal
import type { CollectionConfigT } from "../../headless/src/builders/collection-builder/index.js";

export interface CollectionResT extends CollectionConfigT {
	key: string;
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
