import ISO6391 from "iso-639-1";
import type { LanguageResT } from "@headless/types/src/language.js";
import type { BooleanInt } from "../libs/db/types.js";
import { formatDate } from "../utils/format-helpers.js";

interface FormatLanguageT {
	language: {
		id: number;
		code: string;
		created_at: Date | string | null;
		is_default: BooleanInt;
		is_enabled: BooleanInt;
		updated_at: Date | string | null;
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
		created_at: formatDate(props.language.created_at),
		updated_at: formatDate(props.language.updated_at),
	};
};

export const swaggerLanguageRes = {
	type: "object",
	properties: {
		id: { type: "number", example: 1 },
		code: { type: "string", example: "en" },
		name: { type: "string", example: "English" },
		native_name: { type: "string", example: "English" },
		is_default: { type: "number", example: 1 },
		is_enabled: { type: "number", example: 1 },
		created_at: { type: "string", example: "2021-10-05T14:48:00.000Z" },
		updated_at: { type: "string", example: "2021-10-05T14:48:00.000Z" },
	},
};

export default formatLanguage;
