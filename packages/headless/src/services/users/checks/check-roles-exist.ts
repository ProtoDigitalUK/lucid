import T from "../../../translations/index.js";
import { APIError, modelErrors } from "../../../utils/app/error-handler.js";

export interface ServiceData {
	role_ids: number[];
	is_create: boolean;
}

const checkRolesExist = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.role_ids.length === 0) return;
	const roles = await serviceConfig.db
		.selectFrom("headless_roles")
		.select("id")
		.where("id", "in", data.role_ids)
		.execute();

	if (roles.length !== data.role_ids.length) {
		throw new APIError({
			type: "basic",
			name: data.is_create
				? T("error_not_created_name", {
						name: T("user"),
					})
				: T("error_not_updated_name", {
						name: T("user"),
					}),
			message: data.is_create
				? T("creation_error_message", {
						name: T("user"),
					})
				: T("update_error_message", {
						name: T("user"),
					}),
			status: 400,
			errors: modelErrors({
				role_ids: {
					code: "invalid",
					message: T("error_not_found_message", {
						name: T("role"),
					}),
				},
			}),
		});
	}

	return;
};

export default checkRolesExist;
