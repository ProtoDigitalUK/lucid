import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";

export interface ServiceData {
	id?: number;
}

const getSingleFallback = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.id !== undefined) {
		const language = await serviceConfig.db
			.selectFrom("headless_languages")
			.select(["id", "code"])
			.where("id", "=", data.id)
			.executeTakeFirst();

		if (language === undefined) {
			throw new APIError({
				type: "basic",
				name: T("error_not_found_name", {
					name: T("language"),
				}),
				message: T("error_not_found_message", {
					name: T("language"),
				}),
				status: 404,
			});
		}

		return {
			id: language.id,
			code: language.code,
		};
	}

	const defaultLanguage = await serviceConfig.db
		.selectFrom("headless_languages")
		.select(["id", "code"])
		.where("is_default", "=", true)
		.executeTakeFirst();

	if (defaultLanguage === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("language"),
			}),
			message: T("error_not_found_message", {
				name: T("language"),
			}),
			status: 404,
		});
	}

	return {
		id: defaultLanguage.id,
		code: defaultLanguage.code,
	};
};

export default getSingleFallback;
