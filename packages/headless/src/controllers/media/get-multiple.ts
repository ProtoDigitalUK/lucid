import T from "../../translations/index.js";
import mediaSchema from "../../schemas/media.js";
import {
	swaggerResponse,
	swaggerHeaders,
	swaggerQueryString,
} from "../../utils/swagger-helpers.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import mediaServices from "../../services/media/index.js";
import buildResponse from "../../utils/build-response.js";
import MediaFormatter from "../../libs/formatters/media.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";

const getMultipleController: ControllerT<
	typeof mediaSchema.getMultiple.params,
	typeof mediaSchema.getMultiple.body,
	typeof mediaSchema.getMultiple.query
> = async (request, reply) => {
	try {
		const media = await serviceWrapper(mediaServices.getMultiple, false)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
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
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("method_error_name", {
				service: T("media"),
				method: T("fetch"),
			}),
			message: T("default_error_message"),
			status: 500,
		});
	}
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
					items: MediaFormatter.swagger,
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
