import T from "../../translations/index.js";
import emailsSchema from "../../schemas/email.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import lucidServices from "../../services/index.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import type { RouteController } from "../../types/types.js";

const deleteSingleController: RouteController<
	typeof emailsSchema.deleteSingle.params,
	typeof emailsSchema.deleteSingle.body,
	typeof emailsSchema.deleteSingle.query
> = async (request, reply) => {
	const deleteSingle = await serviceWrapper(
		lucidServices.email.deleteSingle,
		{
			transaction: true,
			defaultError: {
				type: "basic",
				name: T("route_email_delete_error_name"),
				message: T("route_email_delete_error_message"),
				status: 500,
			},
		},
	)(
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
