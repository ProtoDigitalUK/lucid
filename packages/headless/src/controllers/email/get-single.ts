import emailsSchema from "../../schemas/email.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import emailServices from "../../services/email/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import { swaggerEmailsRes } from "../../format/format-emails.js";

const getSingleController: ControllerT<
	typeof emailsSchema.getSingle.params,
	typeof emailsSchema.getSingle.body,
	typeof emailsSchema.getSingle.query
> = async (request, reply) => {
	const email = await serviceWrapper(emailServices.getSingle, false)(
		{
			config: request.server.config,
		},
		{
			id: Number.parseInt(request.params.id, 10),
			render_template: true,
		},
	);

	reply.status(200).send(
		await buildResponse(request, {
			data: email,
		}),
	);
};

export default {
	controller: getSingleController,
	zodSchema: emailsSchema.getSingle,
	swaggerSchema: {
		description: "Returns a single email based on the the id.",
		tags: ["emails"],
		summary: "Get a single email",
		response: {
			200: swaggerResponse({
				type: 200,
				data: swaggerEmailsRes,
			}),
		},
	},
};
