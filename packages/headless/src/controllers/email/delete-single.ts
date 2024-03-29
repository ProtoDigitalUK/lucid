import emailsSchema from "../../schemas/email.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import emailServices from "../../services/email/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";

const deleteSingleController: ControllerT<
	typeof emailsSchema.deleteSingle.params,
	typeof emailsSchema.deleteSingle.body,
	typeof emailsSchema.deleteSingle.query
> = async (request, reply) => {
	await serviceWrapper(emailServices.deleteSingle, true)(
		{
			config: request.server.config,
		},
		{
			id: Number.parseInt(request.params.id, 10),
		},
	);
	reply.status(204).send();
};

export default {
	controller: deleteSingleController,
	zodSchema: emailsSchema.deleteSingle,
	swaggerSchema: {
		description: "Deletes a single email based on the the id.",
		tags: ["emails"],
		summary: "Delete a single email",
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
