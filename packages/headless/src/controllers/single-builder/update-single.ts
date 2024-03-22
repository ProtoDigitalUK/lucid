import singleBuilderSchema from "../../schemas/single-builder.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger/response-helpers.js";
import singleBuilderServices from "../../services/single-builder/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import { swaggerBodyBricksObj } from "../../schemas/bricks.js";

const updateSingleController: ControllerT<
	typeof singleBuilderSchema.updateSingle.params,
	typeof singleBuilderSchema.updateSingle.body,
	typeof singleBuilderSchema.updateSingle.query
> = async (request, reply) => {
	await serviceWrapper(singleBuilderServices.updateSingle, true)(
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
	zodSchema: singleBuilderSchema.updateSingle,
	swaggerSchema: {
		description:
			"Update a single page from the single-builder collection type.",
		tags: ["collection-single-builder"],
		summary: "Update a single builder page",
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
