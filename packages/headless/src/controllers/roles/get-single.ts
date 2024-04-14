import T from "../../translations/index.js";
import rolesSchema from "../../schemas/roles.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import rolesServices from "../../services/roles/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import RolesFormatter from "../../libs/formatters/roles.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";

const getSingleController: ControllerT<
	typeof rolesSchema.getSingle.params,
	typeof rolesSchema.getSingle.body,
	typeof rolesSchema.getSingle.query
> = async (request, reply) => {
	try {
		const role = await serviceWrapper(rolesServices.getSingle, false)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				id: Number.parseInt(request.params.id, 10),
			},
		);

		reply.status(200).send(
			await buildResponse(request, {
				data: role,
			}),
		);
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("method_error_name", {
				service: T("role"),
				method: T("fetch"),
			}),
			message: T("default_error_message"),
			status: 500,
		});
	}
};

export default {
	controller: getSingleController,
	zodSchema: rolesSchema.getSingle,
	swaggerSchema: {
		description: "Returns a single role based on the id URL paramater.",
		tags: ["roles"],
		summary: "Get a single role",
		response: {
			200: swaggerResponse({
				type: 200,
				data: RolesFormatter.swagger,
			}),
		},
	},
};
