import collectionDocumentsSchema from "../../schemas/collection-documents.js";
import {
	swaggerResponse,
	swaggerQueryString,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import collectionDocumentsServices from "../../services/collection-documents/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import { swaggerCollectionDocumentResT } from "../../format/format-collection-document.js";

const getMultipleController: ControllerT<
	typeof collectionDocumentsSchema.getMultiple.params,
	typeof collectionDocumentsSchema.getMultiple.body,
	typeof collectionDocumentsSchema.getMultiple.query
> = async (request, reply) => {
	const documents = await serviceWrapper(
		collectionDocumentsServices.getMultiple,
		false,
	)(
		{
			db: request.server.config.db.client,
			config: request.server.config,
		},
		{
			collection_key: request.params.collection_key,
			query: request.query,
			language_id: request.language.id,
		},
	);

	reply.status(200).send(
		await buildResponse(request, {
			data: documents.data,
			pagination: {
				count: documents.count,
				page: request.query.page,
				perPage: request.query.per_page,
			},
		}),
	);
};

export default {
	controller: getMultipleController,
	zodSchema: collectionDocumentsSchema.getMultiple,
	swaggerSchema: {
		description: "Get a multiple collection document entries.",
		tags: ["collection-documents"],
		summary: "Get a multiple collection document entries.",
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					type: "array",
					items: swaggerCollectionDocumentResT,
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
					key: "slug",
				},
				{
					key: "full_slug",
				},
				{
					key: "category_id",
				},
			],
			sorts: ["created_at", "updated_at"],
			page: true,
			perPage: true,
		}),
	},
};
