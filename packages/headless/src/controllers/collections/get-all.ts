import collectionsSchema from "../../schemas/collections.js";
import { swaggerResponse } from "../../utils/swagger/response-helpers.js";
import collectionsServices from "../../services/collections/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import buildResponse from "../../utils/app/build-response.js";
import { swaggerCollectionRes } from "../../format/format-collection.js";

const getAllController: ControllerT<
	typeof collectionsSchema.getAll.params,
	typeof collectionsSchema.getAll.body,
	typeof collectionsSchema.getAll.query
> = async (request, reply) => {
	const collections = await serviceWrapper(
		collectionsServices.getAll,
		false,
	)({
		db: request.server.db,
	});

	reply.status(200).send(
		await buildResponse(request, {
			data: collections,
		}),
	);
};

export default {
	controller: getAllController,
	zodSchema: collectionsSchema.getAll,
	swaggerSchema: {
		description: "Get all collection instances.",
		tags: ["collections"],
		summary: "Get all collections",
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					type: "array",
					items: swaggerCollectionRes,
				},
			}),
		},
	},
};
