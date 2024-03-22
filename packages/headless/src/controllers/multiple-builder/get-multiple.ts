import multipleBuilderSchema from "../../schemas/multiple-builder.js";
import {
	swaggerResponse,
	swaggerQueryString,
	swaggerHeaders,
} from "../../utils/swagger/response-helpers.js";
import multipleBuilderServices from "../../services/multiple-builder/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import buildResponse from "../../utils/app/build-response.js";
import { swaggerMultipleBuilderResT } from "../../format/format-multiple-builder.js";

const getMultipleController: ControllerT<
	typeof multipleBuilderSchema.getMultiple.params,
	typeof multipleBuilderSchema.getMultiple.body,
	typeof multipleBuilderSchema.getMultiple.query
> = async (request, reply) => {
	const pages = await serviceWrapper(
		multipleBuilderServices.getMultiple,
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
			data: pages.data,
			pagination: {
				count: pages.count,
				page: request.query.page,
				perPage: request.query.per_page,
			},
		}),
	);
};

export default {
	controller: getMultipleController,
	zodSchema: multipleBuilderSchema.getMultiple,
	swaggerSchema: {
		description: "Get a multiple multiple-builder entries.",
		tags: ["collection-multiple-builder"],
		summary: "Get a multiple multiple-builder entries.",
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					type: "array",
					items: swaggerMultipleBuilderResT,
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
					key: "collection_key",
				},
				{
					key: "title",
				},
				{
					key: "slug",
				},
				{
					key: "full_slug",
				},
				{
					key: "category_id",
				},
			],
			sorts: ["created_at", "updated_at", "title", "published_at"],
			page: true,
			perPage: true,
		}),
	},
};
