import collectionDocumentsSchema from "../../schemas/collection-documents.js";
import {
	swaggerResponse,
	swaggerQueryString,
} from "../../utils/swagger-helpers.js";
import collectionDocumentsServices from "../../services/collection-documents/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import buildResponse from "../../utils/build-response.js";
import { swaggerCollectionDocumentResT } from "../../format/format-collection-document.js";

const getSingleController: ControllerT<
	typeof collectionDocumentsSchema.getSingle.params,
	typeof collectionDocumentsSchema.getSingle.body,
	typeof collectionDocumentsSchema.getSingle.query
> = async (request, reply) => {
	const document = await serviceWrapper(
		collectionDocumentsServices.getSingle,
		false,
	)(
		{
			db: request.server.db,
		},
		{
			id: Number.parseInt(request.params.id),
			query: request.query,
		},
	);

	reply.status(200).send(
		await buildResponse(request, {
			data: document,
		}),
	);
};

export default {
	controller: getSingleController,
	zodSchema: collectionDocumentsSchema.getSingle,
	swaggerSchema: {
		description: "Get a single collection document entry by ID.",
		tags: ["collection-documents"],
		summary: "Get a single collection document entry.",
		response: {
			200: swaggerResponse({
				type: 200,
				data: swaggerCollectionDocumentResT,
			}),
		},
		querystring: swaggerQueryString({
			include: ["bricks"],
		}),
	},
};
