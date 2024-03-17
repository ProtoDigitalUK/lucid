import collectionsSchema from "../../schemas/collections.js";
import { swaggerResponse } from "../../utils/swagger/response-helpers.js";
import collectionsServices from "../../services/collections/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";

const deleteSingleController: ControllerT<
	typeof collectionsSchema.deleteSingle.params,
	typeof collectionsSchema.deleteSingle.body,
	typeof collectionsSchema.deleteSingle.query
> = async (request, reply) => {
	await serviceWrapper(collectionsServices.deleteSingle, true)(
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
	zodSchema: collectionsSchema.deleteSingle,
	swaggerSchema: {
		description: "Delete a single collection instance.",
		tags: ["collections"],
		summary: "Delete a collection",
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
	},
};
