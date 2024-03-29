import collectionsSchema from "../../schemas/collections.js";
import { swaggerResponse } from "../../utils/swagger-helpers.js";
import collectionsServices from "../../services/collections/index.js";
import buildResponse from "../../utils/build-response.js";
import { swaggerCollectionRes } from "../../format/format-collection.js";
import serviceWrapper from "../../utils/service-wrapper.js";

const getSingleController: ControllerT<
	typeof collectionsSchema.getSingle.params,
	typeof collectionsSchema.getSingle.body,
	typeof collectionsSchema.getSingle.query
> = async (request, reply) => {
	const collection = await serviceWrapper(
		collectionsServices.getSingle,
		false,
	)(
		{
			config: request.server.config,
		},
		{
			key: request.params.key,
			include: {
				bricks: true,
				fields: true,
				document_id: true,
			},
		},
	);

	reply.status(200).send(
		await buildResponse(request, {
			data: collection,
		}),
	);
};

export default {
	controller: getSingleController,
	zodSchema: collectionsSchema.getSingle,
	swaggerSchema: {
		description: "Get a single collection instance.",
		tags: ["collections"],
		summary: "Get a collection",
		response: {
			200: swaggerResponse({
				type: 200,
				data: swaggerCollectionRes,
			}),
		},
	},
};
