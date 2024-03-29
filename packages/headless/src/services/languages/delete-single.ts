import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import { sql } from "kysely";
import { parseCount } from "../../utils/helpers.js";

export interface ServiceData {
	code: string;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const languagesCountQuery = (await serviceConfig.db
		.selectFrom("headless_languages")
		.select(sql`count(*)`.as("count"))
		.executeTakeFirst()) as { count: string } | undefined;

	const count = parseCount(languagesCountQuery?.count);

	if (count === 1) {
		throw new APIError({
			type: "basic",
			name: T("error_not_min_entries_name", {
				name: T("language"),
			}),
			message: T("error_not_min_entries_message", {
				name: T("language"),
			}),
			status: 500,
		});
	}

	const deleteLanguage = await serviceConfig.db
		.deleteFrom("headless_languages")
		.where("code", "=", data.code)
		.executeTakeFirst();

	if (deleteLanguage.numDeletedRows === 0n) {
		throw new APIError({
			type: "basic",
			name: T("error_not_deleted_name", {
				name: T("language"),
			}),
			message: T("deletion_error_message", {
				name: T("language"),
			}),
			status: 404,
		});
	}

	const defaultLanguages = await serviceConfig.db
		.selectFrom("headless_languages")
		.select("id")
		.where("is_default", "=", 1)
		.execute();

	if (defaultLanguages.length === 0) {
		const firstLanguage = await serviceConfig.db
			.selectFrom("headless_languages")
			.select("id")
			.orderBy("id")
			.limit(1)
			.executeTakeFirst();

		if (firstLanguage === undefined) {
			throw new APIError({
				type: "basic",
				name: T("error_not_deleted_name", {
					name: T("language"),
				}),
				message: T("deletion_error_message", {
					name: T("language").toLowerCase(),
				}),
				status: 500,
			});
		}

		if (firstLanguage) {
			await serviceConfig.db
				.updateTable("headless_languages")
				.set({
					is_default: 1,
					is_enabled: 1,
				})
				.where("id", "=", firstLanguage.id)
				.execute();
		}
	}
};

export default getSingle;
