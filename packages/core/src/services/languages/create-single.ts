import T from "../../translations/index.js";
import { HeadlessAPIError } from "../../utils/error-handler.js";
import type { BooleanInt } from "../../libs/db/types.js";
import ISO6391 from "iso-639-1";
import Repository from "../../libs/repositories/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	code: string;
	isEnabled: BooleanInt;
	isDefault: BooleanInt;
}

const createSingle = async (
	serviceConfig: ServiceConfig,
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
		throw new HeadlessAPIError({
			type: "basic",
			status: 400,
			errorResponse: {
				body: {
					code_value: {
						code: "duplicate",
						message: T("not_unique_error_message"),
					},
				},
			},
		});
	}

	const code = data.code.split("-");
	const iso6391 = code[0];

	if (iso6391 && !ISO6391.validate(iso6391)) {
		throw new HeadlessAPIError({
			type: "basic",
			message: T("error_invalid", {
				type: T("language_iso_639_1"),
			}),
			status: 400,
		});
	}

	const language = await LanguagesRepo.createSingle({
		code: data.code,
		isEnabled: data.isDefault ? 1 : data.isEnabled,
		isDefault: data.isDefault,
	});

	if (language === undefined) {
		throw new HeadlessAPIError({
			type: "basic",
			status: 400,
		});
	}

	if (data.isDefault) {
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
