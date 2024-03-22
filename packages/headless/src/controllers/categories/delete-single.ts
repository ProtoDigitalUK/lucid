import categoriesSchema from "../../schemas/categories.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import categoriesServices from "../../services/categories/index.js";

const deleteSingleController: ControllerT<
	typeof categoriesSchema.deleteSingle.params,
	typeof categoriesSchema.deleteSingle.body,
	typeof categoriesSchema.deleteSingle.query
> = async (request, reply) => {
	await serviceWrapper(categoriesServices.deleteSingle, true)(
		{
			db: request.server.db,
		},
		{
			id: Number.parseInt(request.params.id),
		},
	);

	reply.status(204).send();
};

export default {
	controller: deleteSingleController,
	zodSchema: categoriesSchema.deleteSingle,
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
