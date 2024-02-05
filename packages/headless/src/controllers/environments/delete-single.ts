import environmentsSchema from "../../schemas/environments.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger/response-helpers.js";
import environments from "../../services/environments/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";

const deleteSingleController: ControllerT<
	typeof environmentsSchema.deleteSingle.params,
	typeof environmentsSchema.deleteSingle.body,
	typeof environmentsSchema.deleteSingle.query
> = async (request, reply) => {
	await serviceWrapper(environments.deleteSingle, true)(
		{
			db: request.server.db,
		},
		{
			key: request.params.key,
		},
	);

	reply.status(204).send();
};

export default {
	controller: deleteSingleController,
	zodSchema: environmentsSchema.deleteSingle,
	swaggerSchema: {
		description:
			"Deletes a single environment based on the key URL paramater.",
		tags: ["environments"],
		summary: "Delete a single environment",
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
