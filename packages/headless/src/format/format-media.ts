import type { MediaResT, MediaTypeT } from "@headless/types/src/media.js";
import formatTranslations, {
	swaggerTranslationsRes,
} from "./format-translations.js";

const createURL = (host: string, key: string) => {
	return `${host}/cdn/v1/${key}`;
};

const formatMedia = (
	media: {
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
		created_at: Date | null;
		updated_at: Date | null;
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
	},
	config: {
		host: string;
		isMultiple: boolean;
		languageId?: number;
	},
): MediaResT => {
	return {
		id: media.id,
		key: media.key,
		url: createURL(config.host, media.key),
		translations: formatTranslations([
			{
				key: "title",
				translations: config.isMultiple
					? [
							{
								value: media.title_translation_value ?? null,
								language_id: config.languageId ?? null,
							},
					  ]
					: media.title_translations ?? [],
			},
			{
				key: "alt",
				translations: config.isMultiple
					? [
							{
								value: media.alt_translation_value ?? null,
								language_id: config.languageId ?? null,
							},
					  ]
					: media.alt_translations ?? [],
			},
		]),
		type: media.type as MediaTypeT,
		meta: {
			mime_type: media.mime_type,
			file_extension: media.file_extension,
			file_size: media.file_size,
			width: media.width,
			height: media.height,
		},
		created_at: media.created_at?.toISOString() ?? null,
		updated_at: media.updated_at?.toISOString() ?? null,
	};
};

export const swaggerMediaRes = {
	type: "object",
	properties: {
		id: { type: "number", example: 1 },
		key: { type: "string", example: "placeholder-1708786317482" },
		url: { type: "string", example: "https://example.com/cdn/v1/key" },
		translations: swaggerTranslationsRes,
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

export default formatMedia;
