import T from "../../translations/index.js";
import usersSchema from "../../schemas/users.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import LucidServices from "../../services/index.js";
import buildResponse from "../../utils/build-response.js";
import UsersFormatter from "../../libs/formatters/users.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import type { RouteController } from "../../types/types.js";

const getSingleController: RouteController<
	typeof usersSchema.getSingle.params,
	typeof usersSchema.getSingle.body,
	typeof usersSchema.getSingle.query
> = async (request, reply) => {
	const user = await serviceWrapper(LucidServices.user.getSingle, {
		transaction: false,
		defaultError: {
			type: "basic",
			name: T("route_user_fetch_error_name"),
			message: T("route_user_fetch_error_message"),
			status: 500,
		},
	})(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			userId: Number.parseInt(request.params.id),
		},
	);
	if (user.error) throw new LucidAPIError(user.error);

	reply.status(200).send(
		await buildResponse(request, {
			data: user.data,
		}),
	);
};

export default {
	controller: getSingleController,
	zodSchema: usersSchema.getSingle,
	swaggerSchema: {
		description: "Get a single user.",
		tags: ["users"],
		summary: "Get a single user.",
		response: {
			200: swaggerResponse({
				type: 200,
				data: UsersFormatter.swagger,
			}),
		},
	},
};
