import T from "../../translations/index.js";
import { eq } from "drizzle-orm";
import formatEnvironment from "../../format/format-environment.js";
import { environments } from "../../db/schema.js";
import { APIError } from "../../utils/app/error-handler.js";

export interface ServiceData {
	key: string;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const environmentRes = await serviceConfig.db.query.environments.findFirst({
		where: eq(environments.key, data.key),
		with: {
			assigned_bricks: true,
			assigned_collections: true,
		},
	});

	if (!environmentRes) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("environment"),
			}),
			message: T("error_not_found_message", {
				name: T("environment"),
			}),
			status: 404,
		});
	}

	return formatEnvironment(environmentRes);
};

export default getSingle;
