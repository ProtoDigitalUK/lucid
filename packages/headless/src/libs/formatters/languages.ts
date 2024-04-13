import ISO6391 from "iso-639-1";
import Formatter from "./index.js";
import type { LanguageResT } from "../../types/response.js";
import type { HeadlessLanguages, Select } from "../db/types.js";

export default class LanguagesFormatter {
	formatMultiple = (props: {
		languages: Select<HeadlessLanguages>[];
	}) => {
		return props.languages.map((l) =>
			this.formatSingle({
				language: l,
			}),
		);
	};
	formatSingle = (props: {
		language: Select<HeadlessLanguages>;
	}): LanguageResT => {
		const iso6391Code = props.language.code.split("-")[0];

		return {
			id: props.language.id,
			code: props.language.code,
			name: (iso6391Code && ISO6391.getName(iso6391Code)) || null,
			native_name:
				(iso6391Code && ISO6391.getNativeName(iso6391Code)) || null,
			is_default: props.language.is_default,
			is_enabled: props.language.is_enabled,
			created_at: Formatter.formatDate(props.language.created_at),
			updated_at: Formatter.formatDate(props.language.updated_at),
		};
	};
	static swagger = {
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
}
