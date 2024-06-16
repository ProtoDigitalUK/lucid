import T from "../../translations/index.js";
import emailsSchema from "../../schemas/email.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import emailServices from "../../services/email/index.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import type { RouteController } from "../../types/types.js";

const deleteSingleController: RouteController<
	typeof emailsSchema.deleteSingle.params,
	typeof emailsSchema.deleteSingle.body,
	typeof emailsSchema.deleteSingle.query
> = async (request, reply) => {
	const deleteSingle = await serviceWrapper(emailServices.deleteSingle, {
		transaction: true,
		defaultError: {
			type: "basic",
			name: T("method_error_name", {
				name: T("email"),
				method: T("delete"),
			}),
			message: T("deletion_error_message", {
				name: T("email").toLowerCase(),
			}),
			status: 500,
		},
	})(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			id: Number.parseInt(request.params.id, 10),
		},
	);
	if (deleteSingle.error) throw new LucidAPIError(deleteSingle.error);

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
