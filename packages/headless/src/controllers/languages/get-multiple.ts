import languageSchema from "../../schemas/languages.js";
import {
	swaggerResponse,
	swaggerQueryString,
} from "../../utils/swagger-helpers.js";
import languagesServices from "../../services/languages/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import { swaggerLanguageRes } from "../../format/format-language.js";

const getMultipleController: ControllerT<
	typeof languageSchema.getMultiple.params,
	typeof languageSchema.getMultiple.body,
	typeof languageSchema.getMultiple.query
> = async (request, reply) => {
	const languages = await serviceWrapper(
		languagesServices.getMultiple,
		false,
	)(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			query: request.query,
		},
	);

	reply.status(200).send(
		await buildResponse(request, {
			data: languages.data,
			pagination: {
				count: languages.count,
				page: request.query.page,
				perPage: request.query.per_page,
			},
		}),
	);
};

export default {
	controller: getMultipleController,
	zodSchema: languageSchema.getMultiple,
	swaggerSchema: {
		description:
			"Returns multiple languages based on the query parameters.",
		tags: ["languages"],
		summary: "Get multiple language",
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					type: "array",
					items: swaggerLanguageRes,
				},
				paginated: true,
			}),
		},
		querystring: swaggerQueryString({
			sorts: ["code", "created_at", "updated_at"],
			page: true,
			perPage: true,
		}),
	},
};
