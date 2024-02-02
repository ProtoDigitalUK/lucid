import authSchema from "../../schemas/auth.js";
import { swaggerResponse } from "../../utils/swagger/response-helpers.js";
import auth from "../../services/auth/index.js";
import buildResponse from "../../utils/app/build-response.js";

// --------------------------------------------------
// Controller
const getCSRFController: ControllerT<
	typeof authSchema.getAuthenticatedUser.params,
	typeof authSchema.getAuthenticatedUser.body,
	typeof authSchema.getAuthenticatedUser.query
> = async (request, reply) => {
	const token = await auth.csrf.generateCSRFToken(reply);

	reply.status(200).send(
		await buildResponse(request, {
			data: {
				_csrf: token,
			},
		}),
	);
};

// --------------------------------------------------
// Export
export default {
	controller: getCSRFController,
	zodSchema: authSchema.getCSRF,
	swaggerSchema: {
		description: "Returns a CSRF token",
		tags: ["auth"],
		summary: "Returns a CSRF token",
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					type: "object",
					properties: {
						_csrf: { type: "string" },
					},
				},
			}),
		},
	},
};
