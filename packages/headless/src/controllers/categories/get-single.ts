import categoriesSchema from "../../schemas/categories.js";
import { swaggerResponse } from "../../utils/swagger/response-helpers.js";
import categoriesServices from "../../services/categories/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import buildResponse from "../../utils/app/build-response.js";
import { swaggerCategoryRes } from "../../format/format-category.js";

const getSingleController: ControllerT<
	typeof categoriesSchema.getSingle.params,
	typeof categoriesSchema.getSingle.body,
	typeof categoriesSchema.getSingle.query
> = async (request, reply) => {
	const category = await serviceWrapper(categoriesServices.getSingle, false)(
		{
			db: request.server.db,
		},
		{
			id: parseInt(request.params.id),
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
	zodSchema: categoriesSchema.getSingle,
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
