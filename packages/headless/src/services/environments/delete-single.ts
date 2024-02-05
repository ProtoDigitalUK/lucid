import T from "../../translations/index.js";
import { eq } from "drizzle-orm";
import { environments } from "../../db/schema.js";
import { APIError } from "../../utils/app/error-handler.js";

export interface ServiceData {
	key: string;
}

const deleteSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const environmentsMultiple =
		await serviceConfig.db.query.environments.findMany({
			columns: {
				key: true,
			},
		});

	if (environmentsMultiple.length === 1) {
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
		.delete(environments)
		.where(eq(environments.key, data.key));

	return true;
};

export default deleteSingle;
