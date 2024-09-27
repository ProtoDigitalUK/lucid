import T from "../../translations/index.js";
import collectionDocumentsSchema from "../../schemas/collection-documents.js";
import { swaggerResponse, swaggerHeaders } from "../../utils/swagger/index.js";
import { swaggerBodyBricksObj } from "../../schemas/collection-bricks.js";
import { swaggerFieldObj } from "../../schemas/collection-fields.js";
import formatAPIResponse from "../../utils/build-response.js";
import serviceWrapper from "../../utils/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/errors/index.js";
import type { RouteController } from "../../types/types.js";

const upsertSingleController: RouteController<
	typeof collectionDocumentsSchema.upsertSingle.params,
	typeof collectionDocumentsSchema.upsertSingle.body,
	typeof collectionDocumentsSchema.upsertSingle.query
> = async (request, reply) => {
	const documentId = await serviceWrapper(
		request.server.services.collection.document.upsertSingle,
		{
			transaction: true,
			defaultError: {
				type: "basic",
				name: request.body.documentId
					? T("route_document_update_error_name")
					: T("route_document_create_error_name"),
				message: request.body.documentId
					? T("route_document_update_error_message")
					: T("route_document_create_error_message"),
			},
		},
	)(
		{
			db: request.server.config.db.client,
			config: request.server.config,
			services: request.server.services,
		},
		{
			collectionKey: request.params.collectionKey,
			userId: request.auth.id,
			documentId: request.body.documentId,
			bricks: request.body.bricks,
			fields: request.body.fields,
			publish: request.body.publish ?? 0,
		},
	);
	if (documentId.error) throw new LucidAPIError(documentId.error);

	reply.status(200).send(
		formatAPIResponse(request, {
			data: {
				id: documentId.data,
			},
		}),
	);
};

export default {
	controller: upsertSingleController,
	zodSchema: collectionDocumentsSchema.upsertSingle,
	swaggerSchema: {
		description: "Create or update a single collection document.",
		tags: ["collection-documents"],
		summary: "Create or update a single collection document.",
		body: {
			type: "object",
			properties: {
				documentId: {
					type: "number",
				},
				bricks: {
					type: "array",
					items: swaggerBodyBricksObj,
				},
				fields: {
					type: "array",
					items: swaggerFieldObj,
				},
			},
		},
		response: {
			200: swaggerResponse({
				type: 200,
				data: {
					type: "object",
					properties: {
						id: {
							type: "number",
						},
					},
				},
			}),
		},
		headers: swaggerHeaders({
			csrf: true,
		}),
	},
};
