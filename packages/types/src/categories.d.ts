export interface CategoryResT {
	id: number;
	collection_key: string;
	slug: string;
	title_translations: Array<{
		value: string | null;
		language_id: number | null;
	}>;
	description_translations: {
		language_id: number | null;
		value: string | null;
	}[];
	created_at: string | null;
	updated_at: string | null;
}
