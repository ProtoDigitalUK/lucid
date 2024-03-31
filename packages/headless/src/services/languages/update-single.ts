import T from "../../translations/index.js";
import ISO6391 from "iso-639-1";
import { sql } from "kysely";
import { APIError } from "../../utils/error-handler.js";
import { parseCount } from "../../utils/helpers.js";
import type { BooleanInt } from "../../libs/db/types.js";
import RepositoryFactory from "../../libs/factories/repository-factory.js";

export interface ServiceData {
	current_code: string;
	code?: string;
	is_default?: BooleanInt;
	is_enabled?: BooleanInt;
}

const updateSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (
		data.code === undefined &&
		data.is_default === undefined &&
		data.is_enabled === undefined
	) {
		throw new APIError({
			type: "basic",
			name: T("error_not_updated_name", {
				name: T("language"),
			}),
			message: T("update_error_message", {
				name: T("language"),
			}),
			status: 400,
		});
	}

	const LanguagesRepo = RepositoryFactory.getRepository(
		"languages",
		serviceConfig.db,
	);

	if (data.code) {
		const language = await LanguagesRepo.getSingle({
			select: ["id"],
			where: [
				{
					key: "code",
					operator: "=",
					value: data.code,
				},
			],
		});

		if (language !== undefined) {
			throw new APIError({
				type: "basic",
				name: T("error_not_updated_name", {
					name: T("language"),
				}),
				message: T("update_error_message", {
					name: T("language"),
				}),
				status: 400,
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
	}

	const languagesCountQuery = await LanguagesRepo.getCount();
	const count = parseCount(languagesCountQuery?.count);

	const isDefault = count === 1 ? 1 : data.is_default;

	const updateLanguage = await LanguagesRepo.update({
		data: {
			isDefault: isDefault,
			isEnabled: isDefault === 1 ? 1 : data.is_enabled,
			updated_at: new Date().toISOString(),
		},
		where: [
			{
				key: "code",
				operator: "=",
				value: data.current_code,
			},
		],
	});

	if (updateLanguage === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_updated_name", {
				name: T("language"),
			}),
			message: T("update_error_message", {
				name: T("language").toLowerCase(),
			}),
			status: 400,
		});
	}

	if (isDefault) {
		await LanguagesRepo.update({
			data: {
				isDefault: 0,
			},
			where: [
				{
					key: "id",
					operator: "!=",
					value: updateLanguage.id,
				},
			],
		});
	}
};

export default updateSingle;
