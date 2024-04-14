import T from "../../translations/index.js";
import collectionDocumentsSchema from "../../schemas/collection-documents.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import collectionDocumentsServices from "../../services/collection-documents/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";

const deleteSingleController: ControllerT<
	typeof collectionDocumentsSchema.deleteSingle.params,
	typeof collectionDocumentsSchema.deleteSingle.body,
	typeof collectionDocumentsSchema.deleteSingle.query
> = async (request, reply) => {
	try {
		await serviceWrapper(collectionDocumentsServices.deleteSingle, true)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				id: Number.parseInt(request.params.id),
				collection_key: request.params.collection_key,
				user_id: request.auth.id,
			},
		);

		reply.status(204).send();
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("method_error_name", {
				name: T("document"),
				method: T("delete"),
			}),
			message: T("deletion_error_message", {
				name: T("document").toLowerCase(),
			}),
			status: 500,
		});
	}
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
