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

const getMultipleValidParentsController: ControllerT<
	typeof collectionDocumentsSchema.getMultipleValidParents.params,
	typeof collectionDocumentsSchema.getMultipleValidParents.body,
	typeof collectionDocumentsSchema.getMultipleValidParents.query
> = async (request, reply) => {
	const documents = await serviceWrapper(
		collectionDocumentsServices.getMultipleValidParents,
		false,
	)(
		{
			config: request.server.config,
		},
		{
			collection_key: request.params.collection_key,
			query: request.query,
			language_id: request.language.id,
			document_id: Number.parseInt(request.params.id),
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
	controller: getMultipleValidParentsController,
	zodSchema: collectionDocumentsSchema.getMultipleValidParents,
	swaggerSchema: {
		description:
			"Get a multiple valid collection document parent entries. A valid parent is a page that isnt a descendant of the current page.",
		tags: ["collection-documents"],
		summary: "Get a multiple valid collection document parent entries.",
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
