import authSchema from "../../schemas/auth.js";
import { swaggerResponse } from "../../utils/swagger/response-helpers.js";

const getAuthenticatedUserController: ControllerT<
	typeof authSchema.getAuthenticatedUser.params,
	typeof authSchema.getAuthenticatedUser.body,
	typeof authSchema.getAuthenticatedUser.query
> = async (request, reply) => {
	reply.status(200).send({});
};

export default {
	controller: getAuthenticatedUserController,
	zodSchema: authSchema.getAuthenticatedUser,
	swaggerSchema: {
		description: "Returns user data based on the authenticated user",
		tags: ["auth"],
		summary: "Returns user data based on the authenticated user",
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					hello: { type: "string" },
				},
			}),
		},
	},
};
