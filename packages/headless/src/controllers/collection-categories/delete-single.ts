import collectionCategoriesSchema from "../../schemas/collection-categories.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import collectionCategoriesServices from "../../services/collection-categories/index.js";

const deleteSingleController: ControllerT<
	typeof collectionCategoriesSchema.deleteSingle.params,
	typeof collectionCategoriesSchema.deleteSingle.body,
	typeof collectionCategoriesSchema.deleteSingle.query
> = async (request, reply) => {
	await serviceWrapper(collectionCategoriesServices.deleteSingle, true)(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			id: Number.parseInt(request.params.id),
		},
	);

	reply.status(204).send();
};

export default {
	controller: deleteSingleController,
	zodSchema: collectionCategoriesSchema.deleteSingle,
	swaggerSchema: {
		description: "Delete a single collection category by id.",
		tags: ["collection-categories"],
		summary: "Delete a single collection category.",
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
