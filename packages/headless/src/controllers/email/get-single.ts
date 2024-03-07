import emailsSchema from "../../schemas/email.js";
import { swaggerResponse } from "../../utils/swagger/response-helpers.js";
import emailServices from "../../services/email/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import buildResponse from "../../utils/app/build-response.js";
import { swaggerEmailsRes } from "../../format/format-emails.js";

const getSingleController: ControllerT<
	typeof emailsSchema.getSingle.params,
	typeof emailsSchema.getSingle.body,
	typeof emailsSchema.getSingle.query
> = async (request, reply) => {
	const email = await serviceWrapper(emailServices.getSingle, false)(
		{
			db: request.server.db,
		},
		{
			id: parseInt(request.params.id, 10),
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
