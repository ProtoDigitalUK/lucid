import T from "../../../translations/index.js";
import { sql } from "kysely";
import constants from "../../../constants.js";
import { InternalError } from "../../../utils/error-handler.js";
import { parseCount } from "../../../utils/helpers.js";

const seedDefaultLanguages = async (serviceConfig: ServiceConfigT) => {
	try {
		const totalLanguagesCount = (await serviceConfig.db
			.selectFrom("headless_languages")
			.select(sql`count(*)`.as("count"))
			.executeTakeFirst()) as { count: string } | undefined;

		if (parseCount(totalLanguagesCount?.count) > 0) return;

		await serviceConfig.db
			.insertInto("headless_languages")
			.values({
				code: constants.seedDefaults.language.code,
				is_default: constants.seedDefaults.language.is_default as 0 | 1,
				is_enabled: constants.seedDefaults.language.is_enabled as 0 | 1,
			})
			.execute();
	} catch (error) {
		throw new InternalError(
			T("dynamic_an_error_occurred_saving_default", {
				name: T("language").toLowerCase(),
			}),
		);
	}
};

export default seedDefaultLanguages;
