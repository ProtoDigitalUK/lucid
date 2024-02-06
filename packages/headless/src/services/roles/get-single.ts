import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import { roles } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import formatRole from "../../format/format-roles.js";

export interface ServiceData {
	id: number;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const role = await serviceConfig.db.query.roles.findFirst({
		with: {
			permissions: true,
		},
		where: eq(roles.id, data.id),
	});

	if (!role) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("role"),
			}),
			message: T("error_not_found_message", {
				name: T("role"),
			}),
			status: 404,
		});
	}

	return formatRole(role);
};

export default getSingle;
