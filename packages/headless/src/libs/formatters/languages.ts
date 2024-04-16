import ISO6391 from "iso-639-1";
import Formatter from "./index.js";
import type { LanguageResponse } from "../../types/response.js";
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
	}): LanguageResponse => {
		const iso6391Code = props.language.code.split("-")[0];

		return {
			id: props.language.id,
			code: props.language.code,
			name: (iso6391Code && ISO6391.getName(iso6391Code)) || null,
			nativeName:
				(iso6391Code && ISO6391.getNativeName(iso6391Code)) || null,
			isDefault: props.language.is_default,
			isEnabled: props.language.is_enabled,
			createdAt: Formatter.formatDate(props.language.created_at),
			updatedAt: Formatter.formatDate(props.language.updated_at),
		};
	};
	static swagger = {
		type: "object",
		properties: {
			id: { type: "number", example: 1 },
			code: { type: "string", example: "en" },
			name: { type: "string", example: "English" },
			nativeName: { type: "string", example: "English" },
			isDefault: { type: "number", example: 1 },
			isEnabled: { type: "number", example: 1 },
			createdAt: { type: "string", example: "2021-10-05T14:48:00.000Z" },
			updatedAt: { type: "string", example: "2021-10-05T14:48:00.000Z" },
		},
	};
}
