import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import { sql } from "kysely";

export interface ServiceData {
	key: string;
}

const deleteSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const environments = (await serviceConfig.db
		.selectFrom("headless_environments")
		.select(sql`count(*)`.as("count"))
		.where("key", "=", data.key)
		.executeTakeFirst()) as { count: string };

	const count = parseInt(environments?.count) || 0;

	if (count <= 1) {
		throw new APIError({
			type: "basic",
			name: T("error_not_min_entries_name", {
				name: T("environment"),
			}),
			message: T("error_not_min_entries_message", {
				name: T("environment"),
				required: 1,
			}),
			status: 400,
		});
	}

	await serviceConfig.db
		.deleteFrom("headless_environments")
		.where("key", "=", data.key)
		.execute();

	return true;
};

export default deleteSingle;
