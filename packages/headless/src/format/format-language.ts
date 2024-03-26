import ISO6391 from "iso-639-1";
import type { LanguageResT } from "@headless/types/src/language.js";

interface FormatLanguageT {
	language: {
		id: number;
		code: string;
		created_at: Date | null;
		is_default: boolean;
		is_enabled: boolean;
		updated_at: Date | null;
	};
}

const formatLanguage = (props: FormatLanguageT): LanguageResT => {
	const iso6391Code = props.language.code.split("-")[0];

	return {
		id: props.language.id,
		code: props.language.code,
		name: ISO6391.getName(iso6391Code),
		native_name: ISO6391.getNativeName(iso6391Code),
		is_default: props.language.is_default,
		is_enabled: props.language.is_enabled,
		created_at: props.language.created_at?.toISOString() ?? null,
		updated_at: props.language.updated_at?.toISOString() ?? null,
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
