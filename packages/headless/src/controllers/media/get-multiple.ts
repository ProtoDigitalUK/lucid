import mediaSchema from "../../schemas/media.js";
import {
	swaggerResponse,
	swaggerHeaders,
	swaggerQueryString,
} from "../../utils/swagger-helpers.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import mediaServices from "../../services/media/index.js";
import buildResponse from "../../utils/build-response.js";
import { swaggerMediaRes } from "../../format/format-media.js";

const getMultipleController: ControllerT<
	typeof mediaSchema.getMultiple.params,
	typeof mediaSchema.getMultiple.body,
	typeof mediaSchema.getMultiple.query
> = async (request, reply) => {
	const media = await serviceWrapper(mediaServices.getMultiple, false)(
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
			data: media.data,
			pagination: {
				count: media.count,
				page: request.query.page,
				perPage: request.query.per_page,
			},
		}),
	);
};

export default {
	controller: getMultipleController,
	zodSchema: mediaSchema.getMultiple,
	swaggerSchema: {
		description: "Get a multiple media items.",
		tags: ["media"],
		summary: "Get a multiple media items.",
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					type: "array",
					items: swaggerMediaRes,
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
					key: "key",
				},
				{
					key: "mime_type",
				},
				{
					key: "file_extension",
				},
				{
					key: "type",
				},
				{
					key: "title",
				},
			],
			sorts: [
				"created_at",
				"updated_at",
				"title",
				"file_size",
				"width",
				"height",
				"mime_type",
				"file_extension",
			],
			page: true,
			perPage: true,
		}),
	},
};
