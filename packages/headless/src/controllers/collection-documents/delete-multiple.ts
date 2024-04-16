import T from "../../translations/index.js";
import collectionDocumentsSchema from "../../schemas/collection-documents.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import collectionDocumentsServices from "../../services/collection-documents/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";
import type { RouteController } from "../../types/types.js";

const deleteMultipleController: RouteController<
	typeof collectionDocumentsSchema.deleteMultiple.params,
	typeof collectionDocumentsSchema.deleteMultiple.body,
	typeof collectionDocumentsSchema.deleteMultiple.query
> = async (request, reply) => {
	try {
		await serviceWrapper(collectionDocumentsServices.deleteMultiple, true)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				ids: request.body.ids,
				collectionKey: request.params.collectionKey,
				userId: request.auth.id,
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
	controller: deleteMultipleController,
	zodSchema: collectionDocumentsSchema.deleteMultiple,
	swaggerSchema: {
		description: "Delete a multiple collection documents.",
		tags: ["collection-documents"],
		summary: "Delete multiple collection documents.",
		response: {
			204: swaggerResponse({
				type: 204,
				noPropertise: true,
			}),
		},
		body: {
			type: "object",
			properties: {
				ids: {
					type: "array",
					items: {
						type: "number",
					},
				},
			},
			required: ["ids"],
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
