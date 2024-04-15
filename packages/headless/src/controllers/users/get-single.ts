import T from "../../translations/index.js";
import usersSchema from "../../schemas/users.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import usersServices from "../../services/users/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import UsersFormatter from "../../libs/formatters/users.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";

const getSingleController: ControllerT<
	typeof usersSchema.getSingle.params,
	typeof usersSchema.getSingle.body,
	typeof usersSchema.getSingle.query
> = async (request, reply) => {
	try {
		const user = await serviceWrapper(usersServices.getSingle, false)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				userId: Number.parseInt(request.params.id),
			},
		);

		reply.status(200).send(
			await buildResponse(request, {
				data: user,
			}),
		);
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("method_error_name", {
				name: T("user"),
				method: T("fetch"),
			}),
			message: T("default_error_message"),
			status: 500,
		});
	}
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
