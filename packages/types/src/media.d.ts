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
	// name_translation_key_id: number | null;
	// alt_translation_key_id: number | null;

	translations: {
		language_id: number;
		value: string;
		key: "title" | "alt";
	}[];

	// name_translations: {
	//   id?: number;
	//   language_id: number;
	//   value: string | null;
	// }[];
	// alt_translations: {
	//   id?: number;
	//   language_id: number;
	//   value: string | null;
	// }[];
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
