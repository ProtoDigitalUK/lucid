import T from "../../translations/index.js";
import collectionDocumentsSchema from "../../schemas/collection-documents.js";
import { swaggerResponse, swaggerHeaders } from "../../utils/swagger/index.js";
import { swaggerBodyBricksObj } from "../../schemas/collection-bricks.js";
import { swaggerFieldObj } from "../../schemas/collection-fields.js";
import formatAPIResponse from "../../utils/build-response.js";
import serviceWrapper from "../../utils/services/service-wrapper.js";
import { LucidAPIError } from "../../utils/errors/index.js";
import type { RouteController } from "../../types/types.js";

const createDraftController: RouteController<
	typeof collectionDocumentsSchema.createDraft.params,
	typeof collectionDocumentsSchema.createDraft.body,
	typeof collectionDocumentsSchema.createDraft.query
> = async (request, reply) => {
	const documentId = await serviceWrapper(
		request.server.services.collection.document.upsertSingle,
		{
			transaction: true,
			defaultError: {
				type: "basic",
				name: T("route_document_create_error_name"),
				message: T("route_document_create_error_message"),
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
	controller: createDraftController,
	zodSchema: collectionDocumentsSchema.createDraft,
	swaggerSchema: {
		description: "Create a single collection document draft.",
		tags: ["collection-documents"],
		summary: "Create a single collection document draft.",
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
