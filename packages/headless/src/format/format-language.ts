import ISO6391 from "iso-639-1";
import { LanguageResT } from "@headless/types/src/language.js";

const formatLanguage = (language: {
	id: number;
	code: string;
	created_at: Date | null;
	is_default: boolean;
	is_enabled: boolean;
	updated_at: Date | null;
}): LanguageResT => {
	const iso6391Code = language.code.split("-")[0];

	return {
		id: language.id,
		code: language.code,
		name: ISO6391.getName(iso6391Code),
		native_name: ISO6391.getNativeName(iso6391Code),
		is_default: language.is_default,
		is_enabled: language.is_enabled,
		created_at: language.created_at?.toISOString() ?? null,
		updated_at: language.updated_at?.toISOString() ?? null,
	};
};

export const swaggerLanguageRes = {
	type: "object",
	properties: {
		id: { type: "number", example: 1 },
		code: { type: "string", example: "en" },
		name: { type: "string", example: "English" },
		native_name: { type: "string", example: "English" },
		is_default: { type: "boolean", example: true },
		is_enabled: { type: "boolean", example: true },
		created_at: { type: "string", example: "2021-10-05T14:48:00.000Z" },
		updated_at: { type: "string", example: "2021-10-05T14:48:00.000Z" },
	},
};

export default formatLanguage;
