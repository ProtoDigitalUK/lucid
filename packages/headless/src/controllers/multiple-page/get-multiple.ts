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

const getMultipleController: ControllerT<
	typeof multiplePageSchema.getMultiple.params,
	typeof multiplePageSchema.getMultiple.body,
	typeof multiplePageSchema.getMultiple.query
> = async (request, reply) => {
	const pages = await serviceWrapper(multiplePageServices.getMultiple, false)(
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
	zodSchema: multiplePageSchema.getMultiple,
	swaggerSchema: {
		description: "Get a multiple multiple-page entries.",
		tags: ["collection-multiple-page"],
		summary: "Get a multiple multiple-page entries.",
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
					key: "slug",
				},
				{
					key: "full_slug",
				},
			],
			sorts: ["created_at", "updated_at", "title", "published_at"],
			page: true,
			perPage: true,
		}),
	},
};
