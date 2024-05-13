import T from "../../translations/index.js";
import ISO6391 from "iso-639-1";
import { LucidAPIError } from "../../utils/error-handler.js";
import type { BooleanInt } from "../../libs/db/types.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	currentCode: string;
	code?: string;
	isDefault?: BooleanInt;
	isEnabled?: BooleanInt;
}

const updateSingle = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	if (
		data.code === undefined &&
		data.isDefault === undefined &&
		data.isEnabled === undefined
	) {
		throw new LucidAPIError({
			type: "basic",
			status: 400,
		});
	}

	const LanguagesRepo = Repository.get("languages", serviceConfig.db);

	if (data.code) {
		const language = await LanguagesRepo.selectSingle({
			select: ["code"],
			where: [
				{
					key: "code",
					operator: "=",
					value: data.code,
				},
			],
		});

		if (language !== undefined) {
			throw new LucidAPIError({
				type: "basic",
				status: 400,
			});
		}

		const code = data.code.split("-");
		const iso6391 = code[0];

		if (iso6391 && !ISO6391.validate(iso6391)) {
			throw new LucidAPIError({
				type: "basic",
				message: T("error_invalid", {
					type: T("language_iso_639_1"),
				}),
				status: 400,
			});
		}
	}

	const languagesCountQuery = await LanguagesRepo.count();
	const count = Formatter.parseCount(languagesCountQuery?.count);

	const isDefault = count === 1 ? 1 : data.isDefault;

	const updateLanguage = await LanguagesRepo.updateSingle({
		data: {
			isDefault: isDefault,
			isEnabled: isDefault === 1 ? 1 : data.isEnabled,
			updated_at: new Date().toISOString(),
		},
		where: [
			{
				key: "code",
				operator: "=",
				value: data.currentCode,
			},
		],
	});

	if (updateLanguage === undefined) {
		throw new LucidAPIError({
			type: "basic",
			status: 400,
		});
	}

	if (isDefault) {
		await LanguagesRepo.updateSingle({
			data: {
				isDefault: 0,
			},
			where: [
				{
					key: "code",
					operator: "!=",
					value: updateLanguage.code,
				},
			],
		});
	}
};

export default updateSingle;
