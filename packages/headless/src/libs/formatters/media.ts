import type { MediaResT, MediaTypeT } from "../../types/response.js";
import mediaHelpers from "../../utils/media-helpers.js";
import Formatter from "./index.js";

interface MediaPropsT {
	id: number;
	key: string;
	e_tag: string | null;
	type: string;
	mime_type: string;
	file_extension: string;
	file_size: number;
	width: number | null;
	height: number | null;
	title_translation_key_id: number | null;
	alt_translation_key_id: number | null;
	created_at: Date | string | null;
	updated_at: Date | string | null;
	title_translations?: Array<{
		value: string | null;
		language_id: number | null;
	}>;
	alt_translations?: Array<{
		value: string | null;
		language_id: number | null;
	}>;
	title_translation_value?: string | null;
	alt_translation_value?: string | null;
}

export default class MediaFormatter {
	formatMultiple = (props: {
		media: MediaPropsT[];
		host: string;
	}) => {
		return props.media.map((m) =>
			this.formatSingle({
				media: m,
				host: props.host,
			}),
		);
	};
	formatSingle = (props: {
		media: MediaPropsT;
		host: string;
	}): MediaResT => {
		return {
			id: props.media.id,
			key: props.media.key,
			url: mediaHelpers.createURL(props.host, props.media.key),
			title_translations: props.media.title_translations ?? [],
			alt_translations: props.media.alt_translations ?? [],
			type: props.media.type as MediaTypeT,
			meta: {
				mime_type: props.media.mime_type,
				file_extension: props.media.file_extension,
				file_size: props.media.file_size,
				width: props.media.width,
				height: props.media.height,
			},
			created_at: Formatter.formatDate(props.media.created_at),
			updated_at: Formatter.formatDate(props.media.updated_at),
		};
	};
	static swagger = {
		type: "object",
		properties: {
			id: { type: "number", example: 1 },
			key: { type: "string", example: "placeholder-1708786317482" },
			url: { type: "string", example: "https://example.com/cdn/v1/key" },
			title_translations: {
				type: "array",
				items: {
					type: "object",
					properties: {
						language_id: { type: "number", example: 1 },
						value: { type: "string" },
					},
				},
			},
			alt_translations: {
				type: "array",
				items: {
					type: "object",
					properties: {
						language_id: { type: "number", example: 1 },
						value: {
							type: "string",
						},
					},
				},
			},
			type: { type: "string", example: "image" },
			meta: {
				type: "object",
				properties: {
					mime_type: { type: "string", example: "image/jpeg" },
					file_extension: { type: "string", example: "jpeg" },
					file_size: { type: "number", example: 100 },
					width: { type: "number", example: 100 },
					height: { type: "number", example: 100 },
				},
			},
			created_at: { type: "string", example: "2022-01-01T00:00:00Z" },
			updated_at: { type: "string", example: "2022-01-01T00:00:00Z" },
		},
	};
}
