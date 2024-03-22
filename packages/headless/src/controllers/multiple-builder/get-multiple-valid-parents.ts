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

const getMultipleValidParentsController: ControllerT<
	typeof multipleBuilderSchema.getMultipleValidParents.params,
	typeof multipleBuilderSchema.getMultipleValidParents.body,
	typeof multipleBuilderSchema.getMultipleValidParents.query
> = async (request, reply) => {
	const pages = await serviceWrapper(
		multipleBuilderServices.getMultipleValidParents,
		false,
	)(
		{
			db: request.server.db,
		},
		{
			query: request.query,
			language_id: request.language.id,
			page_id: parseInt(request.params.id),
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
	controller: getMultipleValidParentsController,
	zodSchema: multipleBuilderSchema.getMultipleValidParents,
	swaggerSchema: {
		description:
			"Get a multiple valid multiple-builder parent entries. A valid parent is a page that isnt a descendant of the current page.",
		tags: ["collection-multiple-builder"],
		summary: "Get a multiple valid multiple-builder parent entries.",
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
					key: "category_id",
				},
			],
			sorts: ["created_at", "updated_at", "title"],
			page: true,
			perPage: true,
		}),
	},
};
