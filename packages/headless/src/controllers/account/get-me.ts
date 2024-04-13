import { APIError } from "../../utils/error-handler.js";
import accountSchema from "../../schemas/account.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import buildResponse from "../../utils/build-response.js";
import usersServices from "../../services/users/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import UsersFormatter from "../../libs/formatters/users.js";

const getMeController: ControllerT<
	typeof accountSchema.getMe.params,
	typeof accountSchema.getMe.body,
	typeof accountSchema.getMe.query
> = async (request, reply) => {
	try {
		const user = await serviceWrapper(usersServices.getSingle, false)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				user_id: request.auth.id,
			},
		);

		reply.status(200).send(
			await buildResponse(request, {
				data: user,
			}),
		);
	} catch (error) {
		if (error instanceof APIError) {
			if (error.name === undefined) error.name = "Fetch User Error";
			if (error.message === undefined)
				error.message = "Error while fetching user data";
			if (error.status === undefined) error.status = 500;
			throw error;
		}

		throw new APIError({
			type: "basic",
			name: "Fetch User Error",
			message: "Error while fetching user data",
			status: 500,
		});
	}
};

export default {
	controller: getMeController,
	zodSchema: accountSchema.getMe,
	swaggerSchema: {
		description: "Returns user data based on the authenticated user",
		tags: ["account"],
		summary: "Returns user data based on the authenticated user",
		response: {
			200: swaggerResponse({
				type: 200,
				data: UsersFormatter.swagger,
			}),
		},
	},
};
