import accountSchema from "../../schemas/account.js";
import { swaggerResponse } from "../../utils/swagger/response-helpers.js";
import buildResponse from "../../utils/app/build-response.js";
import account from "../../services/account/index.js";
import { swaggerUsersRes } from "../../format/format-user.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";

const getMeController: ControllerT<
	typeof accountSchema.getMe.params,
	typeof accountSchema.getMe.body,
	typeof accountSchema.getMe.query
> = async (request, reply) => {
	const user = await serviceWrapper(account.getAuthenticatedUser, false)(
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
	controller: getMeController,
	zodSchema: accountSchema.getMe,
	swaggerSchema: {
		description: "Returns user data based on the authenticated user",
		tags: ["account"],
		summary: "Returns user data based on the authenticated user",
		response: {
			200: swaggerResponse({
				type: 200,
				data: swaggerUsersRes,
			}),
		},
	},
};
