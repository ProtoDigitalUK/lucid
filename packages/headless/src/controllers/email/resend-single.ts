import emailsSchema from "../../schemas/email.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import emailServices from "../../services/email/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";

const resendSingleController: ControllerT<
	typeof emailsSchema.resendSingle.params,
	typeof emailsSchema.resendSingle.body,
	typeof emailsSchema.resendSingle.query
> = async (request, reply) => {
	const emailRes = await serviceWrapper(emailServices.resendSingle, true)(
		{
			config: request.server.config,
		},
		{
			id: Number.parseInt(request.params.id, 10),
		},
	);

	reply.status(200).send(
		await buildResponse(request, {
			data: emailRes,
		}),
	);
};

export default {
	controller: resendSingleController,
	zodSchema: emailsSchema.resendSingle,
	swaggerSchema: {
		description: "Resends the email with the given ID",
		tags: ["emails"],
		summary: "Resend email",
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					type: "object",
					properties: {
						success: {
							type: "boolean",
						},
						message: {
							type: "string",
						},
					},
				},
			}),
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
