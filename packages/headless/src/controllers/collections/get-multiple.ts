import collectionsSchema from "../../schemas/collections.js";
import {
	swaggerResponse,
	swaggerQueryString,
} from "../../utils/swagger/response-helpers.js";
import collectionsServices from "../../services/collections/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import buildResponse from "../../utils/app/build-response.js";
import { swaggerCollectionRes } from "../../format/format-collection.js";

const getMultipleController: ControllerT<
	typeof collectionsSchema.getMultiple.params,
	typeof collectionsSchema.getMultiple.body,
	typeof collectionsSchema.getMultiple.query
> = async (request, reply) => {
	const collections = await serviceWrapper(
		collectionsServices.getMultiple,
		false,
	)(
		{
			db: request.server.db,
		},
		{
			query: request.query,
		},
	);

	reply.status(200).send(
		await buildResponse(request, {
			data: collections.data,
			pagination: {
				count: collections.count,
				page: request.query.page,
				perPage: request.query.per_page,
			},
		}),
	);
};

export default {
	controller: getMultipleController,
	zodSchema: collectionsSchema.getMultiple,
	swaggerSchema: {
		description:
			"Get a single collection instance based on the query parameters.",
		tags: ["collections"],
		summary: "Get multiple collections",
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					type: "array",
					items: swaggerCollectionRes,
				},
				paginated: true,
			}),
		},
		querystring: swaggerQueryString({
			include: ["bricks"],
			filters: [
				{
					key: "type",
					enum: ["single-builder", "multiple-builder"],
				},
			],
			sorts: ["title", "created_at", "updated_at"],
			page: true,
			perPage: true,
		}),
	},
};
