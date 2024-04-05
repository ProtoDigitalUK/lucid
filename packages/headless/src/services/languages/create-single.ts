import T from "../../translations/index.js";
import { APIError, modelErrors } from "../../utils/error-handler.js";
import type { BooleanInt } from "../../libs/db/types.js";
import ISO6391 from "iso-639-1";
import Repository from "../../libs/repositories/index.js";

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

	const LanguagesRepo = Repository.get("languages", serviceConfig.db);

	const codeUnique = await LanguagesRepo.selectSingle({
		select: ["id"],
		where: [
			{
				key: "code",
				operator: "=",
				value: data.code,
			},
		],
	});

	if (codeUnique !== undefined) {
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

	const language = await LanguagesRepo.createSingle({
		code: data.code,
		isEnabled: data.is_default ? 1 : data.is_enabled,
		isDefault: data.is_default,
	});

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
		await LanguagesRepo.updateSingle({
			data: {
				isDefault: 0,
			},
			where: [
				{
					key: "id",
					operator: "!=",
					value: language.id,
				},
			],
		});
	}

	return language.code;
};

export default createSingle;
