export type MediaTypeT =
	| "image"
	| "video"
	| "audio"
	| "document"
	| "archive"
	| "unknown";

export interface MediaResT {
	id: number;
	key: string;
	url: string;
	title_translations: {
		language_id: number | null;
		value: string | null;
	}[];
	alt_translations: {
		language_id: number | null;
		value: string | null;
	}[];
	type: MediaTypeT;
	meta: {
		mime_type: string;
		file_extension: string;
		file_size: number;
		width: number | null;
		height: number | null;
	};
	created_at: string | null;
	updated_at: string | null;
}
