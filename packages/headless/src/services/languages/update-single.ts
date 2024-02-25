import T from "../../translations/index.js";
import ISO6391 from "iso-639-1";
import { sql } from "kysely";
import { APIError } from "../../utils/app/error-handler.js";
import { parseCount } from "../../utils/app/helpers.js";

export interface ServiceData {
	current_code: string;
	code?: string;
	is_default?: boolean;
	is_enabled?: boolean;
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
			name: T("dynamic_error_name", {
				name: T("language"),
			}),
			message: T("update_error_message", {
				name: T("language"),
			}),
			status: 400,
		});
	}

	if (data.code) {
		const language = await serviceConfig.db
			.selectFrom("headless_languages")
			.select("id")
			.where("code", "=", data.code)
			.executeTakeFirst();

		if (language !== undefined) {
			throw new APIError({
				type: "basic",
				name: T("dynamic_error_name", {
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

	const languagesCountQuery = (await serviceConfig.db
		.selectFrom("headless_languages")
		.select(sql`count(*)`.as("count"))
		.executeTakeFirst()) as { count: string } | undefined;

	const count = parseCount(languagesCountQuery?.count);

	const isDefault = count === 1 ? true : data.is_default;

	const updateLanguage = await serviceConfig.db
		.updateTable("headless_languages")
		.set({
			code: data.code,
			is_default: isDefault,
			is_enabled: isDefault === true ? true : data.is_enabled,
			updated_at: new Date().toISOString(),
		})
		.where("code", "=", data.current_code)
		.returning("id")
		.executeTakeFirst();

	if (updateLanguage === undefined) {
		throw new APIError({
			type: "basic",
			name: T("dynamic_error_name", {
				name: T("language"),
			}),
			message: T("update_error_message", {
				name: T("language").toLowerCase(),
			}),
			status: 400,
		});
	}

	if (isDefault) {
		await serviceConfig.db
			.updateTable("headless_languages")
			.set({
				is_default: false,
			})
			.where("id", "!=", updateLanguage.id)
			.execute();
	}
};

export default updateSingle;
