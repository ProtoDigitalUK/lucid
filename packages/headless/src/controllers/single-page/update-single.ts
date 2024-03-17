import singlePageSchema from "../../schemas/single-page.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger/response-helpers.js";
import singlePageServices from "../../services/single-page/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import { swaggerBodyBricksObj } from "../../schemas/bricks.js";

const updateSingleController: ControllerT<
	typeof singlePageSchema.updateSingle.params,
	typeof singlePageSchema.updateSingle.body,
	typeof singlePageSchema.updateSingle.query
> = async (request, reply) => {
	await serviceWrapper(singlePageServices.updateSingle, true)(
		{
			db: request.server.db,
		},
		{
			collection_key: request.params.collection_key,
			bricks: request.body.bricks,
			user_id: request.auth.id,
		},
	);

	reply.status(204).send();
};

export default {
	controller: updateSingleController,
	zodSchema: singlePageSchema.updateSingle,
	swaggerSchema: {
		description:
			"Update a single page from the single-page collection type.",
		tags: ["collection-single-page"],
		summary: "Update a single page",
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
		body: {
			type: "object",
			properties: {
				bricks: {
					type: "array",
					items: swaggerBodyBricksObj,
				},
			},
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
