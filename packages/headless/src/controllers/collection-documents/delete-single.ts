import collectionDocumentsSchema from "../../schemas/collection-documents.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import collectionDocumentsServices from "../../services/collection-documents/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";

const deleteSingleController: ControllerT<
	typeof collectionDocumentsSchema.deleteSingle.params,
	typeof collectionDocumentsSchema.deleteSingle.body,
	typeof collectionDocumentsSchema.deleteSingle.query
> = async (request, reply) => {
	await serviceWrapper(collectionDocumentsServices.deleteSingle, true)(
		{
			config: request.server.config,
		},
		{
			id: Number.parseInt(request.params.id),
			user_id: request.auth.id,
		},
	);

	reply.status(204).send();
};

export default {
	controller: deleteSingleController,
	zodSchema: collectionDocumentsSchema.deleteSingle,
	swaggerSchema: {
		description: "Delete a single collection document.",
		tags: ["collection-documents"],
		summary: "Delete a collection document",
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
