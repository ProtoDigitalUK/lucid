import T from "../../translations/index.js";
import { APIError, modelErrors } from "../../utils/error-handler.js";
import type { BooleanInt } from "../../libs/db/types.js";
import ISO6391 from "iso-639-1";

export interface ServiceData {
	code: string;
	is_enabled: BooleanInt;
	is_default: BooleanInt;
}

const createSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	// If is default, it has to be enabled
	// There can only be one default language

	const codeUnique = await serviceConfig.db
		.selectFrom("headless_languages")
		.select("id")
		.where("code", "=", data.code)
		.executeTakeFirst();

	if (codeUnique) {
		throw new APIError({
			type: "basic",
			name: T("error_not_created_name", {
				name: T("language"),
			}),
			message: T("creation_error_message", {
				name: T("language").toLowerCase(),
			}),
			status: 400,
			errors: modelErrors({
				code_value: {
					code: "duplicate",
					message: T("not_unique_error_message"),
				},
			}),
		});
	}

	const code = data.code.split("-");
	const iso6391 = code[0];

	if (!ISO6391.validate(iso6391)) {
		throw new APIError({
			type: "basic",
			name: T("dynamic_error_name", {
				name: T("language"),
			}),
			message: T("error_invalid", {
				type: T("language_iso_639_1"),
			}),
			status: 400,
		});
	}

	const language = await serviceConfig.db
		.insertInto("headless_languages")
		.values({
			code: data.code,
			is_enabled: data.is_default ? 1 : data.is_enabled,
			is_default: data.is_default,
		})
		.returning(["id", "code"])
		.executeTakeFirst();

	if (language === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_created_name", {
				name: T("language"),
			}),
			message: T("creation_error_message", {
				name: T("language").toLowerCase(),
			}),
			status: 400,
		});
	}

	if (data.is_default) {
		await serviceConfig.db
			.updateTable("headless_languages")
			.set({
				is_default: 0,
			})
			.where("id", "!=", language.id)
			.execute();
	}

	return language.code;
};

export default createSingle;
