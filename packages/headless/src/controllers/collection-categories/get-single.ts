import collectionCategoriesSchema from "../../schemas/collection-categories.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import collectionCategoriesServices from "../../services/collection-categories/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import { swaggerCategoryRes } from "../../format/format-collection-categories.js";

const getSingleController: ControllerT<
	typeof collectionCategoriesSchema.getSingle.params,
	typeof collectionCategoriesSchema.getSingle.body,
	typeof collectionCategoriesSchema.getSingle.query
> = async (request, reply) => {
	const category = await serviceWrapper(
		collectionCategoriesServices.getSingle,
		false,
	)(
		{
			db: request.server.db,
		},
		{
			id: Number.parseInt(request.params.id),
		},
	);

	reply.status(200).send(
		await buildResponse(request, {
			data: category,
		}),
	);
};

export default {
	controller: getSingleController,
	zodSchema: collectionCategoriesSchema.getSingle,
	swaggerSchema: {
		description: "Get a single collection category by ID",
		tags: ["collection-categories"],
		summary: "Get a collection category",
		response: {
			200: swaggerResponse({
				type: 200,
				data: swaggerCategoryRes,
			}),
		},
	},
};
