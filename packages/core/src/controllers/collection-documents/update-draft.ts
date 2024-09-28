import T from "../../translations/index.js";
import collectionDocumentsSchema from "../../schemas/collection-documents.js";
import { swaggerResponse, swaggerHeaders } from "../../utils/swagger/index.js";
import { swaggerBodyBricksObj } from "../../schemas/collection-bricks.js";
import { swaggerFieldObj } from "../../schemas/collection-fields.js";
import formatAPIResponse from "../../utils/build-response.js";
import serviceWrapper from "../../utils/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/errors/index.js";
import type { RouteController } from "../../types/types.js";

const updateDraftController: RouteController<
	typeof collectionDocumentsSchema.updateDraft.params,
	typeof collectionDocumentsSchema.updateDraft.body,
	typeof collectionDocumentsSchema.updateDraft.query
> = async (request, reply) => {
	const documentId = await serviceWrapper(
		request.server.services.collection.document.upsertSingle,
		{
			transaction: true,
			defaultError: {
				type: "basic",
				name: T("route_document_update_error_name"),
				message: T("route_document_update_error_message"),
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
			publish: 0,
			userId: request.auth.id,
			documentId: Number.parseInt(request.params.id),
			bricks: request.body.bricks,
			fields: request.body.fields,
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
	controller: updateDraftController,
	zodSchema: collectionDocumentsSchema.updateDraft,
	swaggerSchema: {
		description: "Update a single collection documents draft version.",
		tags: ["collection-documents"],
		summary: "Update a single collection documents draft version.",
		body: {
			type: "object",
			properties: {
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
