import authSchema from "../../schemas/auth.js";
import { swaggerResponse } from "../../utils/swagger/response-helpers.js";
import buildResponse from "../../utils/app/build-response.js";
import auth from "../../services/auth/index.js";
import { swaggerUsersRes } from "../../format/format-user.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";

const getAuthenticatedUserController: ControllerT<
	typeof authSchema.getAuthenticatedUser.params,
	typeof authSchema.getAuthenticatedUser.body,
	typeof authSchema.getAuthenticatedUser.query
> = async (request, reply) => {
	const user = await serviceWrapper(auth.getAuthenticatedUser, false)(
		{
			db: request.server.db,
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
				data: swaggerUsersRes,
			}),
		},
	},
};
