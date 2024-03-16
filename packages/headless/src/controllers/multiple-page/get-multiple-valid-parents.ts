import multiplePageSchema from "../../schemas/multiple-page.js";
import {
	swaggerResponse,
	swaggerQueryString,
	swaggerHeaders,
} from "../../utils/swagger/response-helpers.js";
import multiplePageServices from "../../services/multiple-page/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import buildResponse from "../../utils/app/build-response.js";
import { swaggerMultiplePageRes } from "../../format/format-multiple-page.js";

const getMultipleValidParentsController: ControllerT<
	typeof multiplePageSchema.getMultipleValidParents.params,
	typeof multiplePageSchema.getMultipleValidParents.body,
	typeof multiplePageSchema.getMultipleValidParents.query
> = async (request, reply) => {
	const pages = await serviceWrapper(
		multiplePageServices.getMultipleValidParents,
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
	zodSchema: multiplePageSchema.getMultipleValidParents,
	swaggerSchema: {
		description:
			"Get a multiple valid multiple-page parent entries. A valid parent is a page that isnt a descendant of the current page.",
		tags: ["collection-multiple-page"],
		summary: "Get a multiple valid multiple-page parent entries.",
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					type: "array",
					items: swaggerMultiplePageRes,
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
