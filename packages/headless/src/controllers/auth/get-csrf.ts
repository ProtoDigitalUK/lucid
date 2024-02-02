import authSchema from "../../schemas/auth.js";
import { swaggerResponse } from "../../utils/swagger/response-helpers.js";
import auth from "../../services/auth/index.js";
import buildResponse from "../../utils/app/build-response.js";

// --------------------------------------------------
// Controller
const getCSRFController: ControllerT<
	typeof authSchema.getCSRF.params,
	typeof authSchema.getCSRF.body,
	typeof authSchema.getCSRF.query
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
		description:
			"This route returns a CSRF token in the response body and also sets a _csrf httpOnly cookie. The client can use this token on required routes by setting a _csrf header. On required routes this header will be checked against the _csrf cookie.",
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
