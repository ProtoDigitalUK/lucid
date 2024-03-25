import categorySchema from "../../schemas/collection-categories.js";
import {
	swaggerResponse,
	swaggerHeaders,
	swaggerQueryString,
} from "../../utils/swagger-helpers.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import collectionCategoriesServices from "../../services/collection-categories/index.js";
import buildResponse from "../../utils/build-response.js";
import { swaggerCategoryRes } from "../../format/format-collection-categories.js";

const getMultipleController: ControllerT<
	typeof categorySchema.getMultiple.params,
	typeof categorySchema.getMultiple.body,
	typeof categorySchema.getMultiple.query
> = async (request, reply) => {
	const categories = await serviceWrapper(
		collectionCategoriesServices.getMultiple,
		false,
	)(
		{
			db: request.server.db,
		},
		{
			query: request.query,
			language_id: request.language.id,
		},
	);

	reply.status(200).send(
		await buildResponse(request, {
			data: categories.data,
			pagination: {
				count: categories.count,
				page: request.query.page,
				perPage: request.query.per_page,
			},
		}),
	);
};

export default {
	controller: getMultipleController,
	zodSchema: categorySchema.getMultiple,
	swaggerSchema: {
		description: "Get a multiple collection categories.",
		tags: ["collection-categories"],
		summary: "Get a multiple collection categories.",
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					type: "array",
					items: swaggerCategoryRes,
				},
				paginated: true,
			}),
		},
		headers: swaggerHeaders({
			contentLanguage: true,
		}),
		querystring: swaggerQueryString({
			filters: [
				{
					key: "title",
				},
				{
					key: "collection_key",
				},
				{
					key: "slug",
				},
			],
			sorts: ["created_at", "updated_at", "title", "slug"],
			page: true,
			perPage: true,
		}),
	},
};