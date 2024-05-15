import type { MediaResponse, MediaType } from "../../types/response.js";
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
		locale_code: string | null;
	}>;
	alt_translations?: Array<{
		value: string | null;
		locale_code: string | null;
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
	}): MediaResponse => {
		return {
			id: props.media.id,
			key: props.media.key,
			url: mediaHelpers.createURL(props.host, props.media.key),
			titleTranslations:
				props.media.title_translations?.map((t) => ({
					value: t.value,
					localeCode: t.locale_code,
				})) ?? [],
			altTranslations:
				props.media.alt_translations?.map((t) => ({
					value: t.value,
					localeCode: t.locale_code,
				})) ?? [],
			type: props.media.type as MediaType,
			meta: {
				mimeType: props.media.mime_type,
				fileExtension: props.media.file_extension,
				fileSize: props.media.file_size,
				width: props.media.width,
				height: props.media.height,
			},
			createdAt: Formatter.formatDate(props.media.created_at),
			updatedAt: Formatter.formatDate(props.media.updated_at),
		};
	};
	static swagger = {
		type: "object",
		properties: {
			id: { type: "number", example: 1 },
			key: { type: "string", example: "placeholder-1708786317482" },
			url: { type: "string", example: "https://example.com/cdn/v1/key" },
			titleTranslations: {
				type: "array",
				items: {
					type: "object",
					properties: {
						localeCode: { type: "string", example: "en" },
						value: { type: "string" },
					},
				},
			},
			altTranslations: {
				type: "array",
				items: {
					type: "object",
					properties: {
						localeCode: { type: "string", example: "en" },
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
					mimeType: { type: "string", example: "image/jpeg" },
					fileExtension: { type: "string", example: "jpeg" },
					fileSize: { type: "number", example: 100 },
					width: { type: "number", example: 100 },
					height: { type: "number", example: 100 },
				},
			},
			createdAt: { type: "string", example: "2022-01-01T00:00:00Z" },
			updatedAt: { type: "string", example: "2022-01-01T00:00:00Z" },
		},
	};
}
