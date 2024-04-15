import T from "../../translations/index.js";
import collectionDocumentsSchema from "../../schemas/collection-documents.js";
import {
	swaggerResponse,
	swaggerHeaders,
} from "../../utils/swagger-helpers.js";
import collectionDocumentsServices from "../../services/collection-documents/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import { swaggerBodyBricksObj } from "../../schemas/collection-bricks.js";
import { swaggerFieldObj } from "../../schemas/collection-fields.js";
import buildResponse from "../../utils/build-response.js";
import { ensureThrowAPIError } from "../../utils/error-helpers.js";

const upsertSingleController: ControllerT<
	typeof collectionDocumentsSchema.upsertSingle.params,
	typeof collectionDocumentsSchema.upsertSingle.body,
	typeof collectionDocumentsSchema.upsertSingle.query
> = async (request, reply) => {
	try {
		const documentId = await serviceWrapper(
			collectionDocumentsServices.upsertSingle,
			true,
		)(
			{
				db: request.server.config.db.client,
				config: request.server.config,
			},
			{
				collectionKey: request.params.collectionKey,
				userId: request.auth.id,
				documentId: request.body.documentId,
				bricks: request.body.bricks,
				fields: request.body.fields,
			},
		);

		reply.status(200).send(
			await buildResponse(request, {
				data: {
					id: documentId,
				},
			}),
		);
	} catch (error) {
		ensureThrowAPIError(error, {
			type: "basic",
			name: T("method_error_name", {
				name: T("document"),
				method: request.body.documentId ? T("update") : T("create"),
			}),
			message: T(
				request.body.documentId
					? "update_error_message"
					: "creation_error_message",
				{
					name: T("document").toLowerCase(),
				},
			),
			status: 500,
		});
	}
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
