import T from "../../translations/index.js";
import authSchema from "../../schemas/auth.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import auth from "../../services/auth/index.js";
import buildResponse from "../../utils/build-response.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";

const getCSRFController: ControllerT<
	typeof authSchema.getCSRF.params,
	typeof authSchema.getCSRF.body,
	typeof authSchema.getCSRF.query
> = async (request, reply) => {
	try {
		const token = await auth.csrf.generateCSRFToken(reply);

		reply.status(200).send(
			await buildResponse(request, {
				data: {
					_csrf: token,
				},
			}),
		);
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("default_error_name"),
			message: T("default_error_message"),
			status: 500,
		});
	}
};

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
