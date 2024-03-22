import publicPagesSchema from "../../../schemas/public-pages.js";
import {
	swaggerResponse,
	swaggerQueryString,
} from "../../../utils/swagger-helpers.js";

const getSingleController: ControllerT<
	typeof publicPagesSchema.getSingle.params,
	typeof publicPagesSchema.getSingle.body,
	typeof publicPagesSchema.getSingle.query
> = async (request, reply) => {
	reply.status(204).send();
};

export default {
	controller: getSingleController,
	zodSchema: publicPagesSchema.getSingle,
	swaggerSchema: {
		description: "Returns a single page based on the provided full slug",
		tags: ["public-pages"],
		summary: "Get a single page",
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
		querystring: swaggerQueryString({
			filters: [
				{
					key: "full_slug",
				},
				{
					key: "collection_slug",
				},
			],
		}),
	},
};
