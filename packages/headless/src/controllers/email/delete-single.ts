import T from "../../translations/index.js";
import emailsSchema from "../../schemas/email.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import emailServices from "../../services/email/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";

const deleteSingleController: ControllerT<
	typeof emailsSchema.deleteSingle.params,
	typeof emailsSchema.deleteSingle.body,
	typeof emailsSchema.deleteSingle.query
> = async (request, reply) => {
	try {
		await serviceWrapper(emailServices.deleteSingle, true)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				id: Number.parseInt(request.params.id, 10),
			},
		);
		reply.status(204).send();
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("method_error_name", {
				service: T("email"),
				method: T("delete"),
			}),
			message: T("default_error_message"),
			status: 500,
		});
	}
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
